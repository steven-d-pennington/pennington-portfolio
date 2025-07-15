# AWS ECS Fargate Deployment Script for Steven Pennington Portfolio (PowerShell)
# This script deploys the portfolio to AWS ECS Fargate using CloudFormation

param(
    [string]$Environment = "production",
    [string]$Region = "us-east-1",
    [string]$DomainName = "portfolio.stevenpennington.com",
    [string]$CertificateArn = "",
    [string]$OpenAIApiKey = "",
    [string]$SupabaseUrl = "",
    [string]$SupabaseAnonKey = "",
    [string]$GmailUserEmail = "",
    [string]$GmailClientId = "",
    [string]$GmailClientSecret = "",
    [string]$GmailRefreshToken = ""
)

# Configuration
$StackName = "pennington-portfolio-$Environment"
$VpcStackName = "pennington-portfolio-vpc-$Environment"
$EcrStackName = "pennington-portfolio-ecr-$Environment"

# Function to write colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Function to check if AWS CLI is installed and configured
function Test-AwsCli {
    try {
        $null = Get-Command aws -ErrorAction Stop
    }
    catch {
        Write-Error "AWS CLI is not installed. Please install it first."
        exit 1
    }
    
    try {
        $null = aws sts get-caller-identity 2>$null
    }
    catch {
        Write-Error "AWS CLI is not configured. Please run 'aws configure' first."
        exit 1
    }
    
    Write-Success "AWS CLI is configured"
}

# Function to check if Docker is installed and running
function Test-Docker {
    try {
        $null = Get-Command docker -ErrorAction Stop
    }
    catch {
        Write-Error "Docker is not installed. Please install it first."
        exit 1
    }
    
    try {
        $null = docker info 2>$null
    }
    catch {
        Write-Error "Docker is not running. Please start Docker first."
        exit 1
    }
    
    Write-Success "Docker is running"
}

# Function to build and push Docker image
function Build-And-Push-Image {
    Write-Status "Building Docker image..."
    
    # Get ECR repository URI
    try {
        $EcrRepoUri = aws cloudformation describe-stacks `
            --stack-name $EcrStackName `
            --region $Region `
            --query 'Stacks[0].Outputs[?OutputKey==`RepositoryUri`].OutputValue' `
            --output text 2>$null
        
        if (-not $EcrRepoUri) {
            Write-Error "ECR repository not found. Please deploy ECR stack first."
            exit 1
        }
    }
    catch {
        Write-Error "Failed to get ECR repository URI"
        exit 1
    }
    
    # Build image
    Write-Status "Building Docker image..."
    docker build -t pennington-portfolio .
    
    # Tag image
    Write-Status "Tagging Docker image..."
    docker tag pennington-portfolio:latest "$EcrRepoUri`:latest"
    
    # Login to ECR
    Write-Status "Logging into ECR..."
    aws ecr get-login-password --region $Region | docker login --username AWS --password-stdin $EcrRepoUri
    
    # Push image
    Write-Status "Pushing Docker image to ECR..."
    docker push "$EcrRepoUri`:latest"
    
    Write-Success "Docker image pushed to ECR"
}

# Function to deploy VPC stack
function Deploy-Vpc {
    Write-Status "Deploying VPC stack..."
    
    aws cloudformation deploy `
        --template-file aws/cloudformation/vpc.yaml `
        --stack-name $VpcStackName `
        --parameter-overrides Environment=$Environment `
        --capabilities CAPABILITY_IAM `
        --region $Region
    
    Write-Success "VPC stack deployed"
}

# Function to deploy ECR stack
function Deploy-Ecr {
    Write-Status "Deploying ECR stack..."
    
    aws cloudformation deploy `
        --template-file aws/cloudformation/ecr.yaml `
        --stack-name $EcrStackName `
        --parameter-overrides Environment=$Environment `
        --capabilities CAPABILITY_IAM `
        --region $Region
    
    Write-Success "ECR stack deployed"
}

# Function to deploy main application stack
function Deploy-Application {
    Write-Status "Deploying application stack..."
    
    # Get VPC outputs
    try {
        $VpcId = aws cloudformation describe-stacks `
            --stack-name $VpcStackName `
            --region $Region `
            --query 'Stacks[0].Outputs[?OutputKey==`VpcId`].OutputValue' `
            --output text
        
        $PublicSubnets = aws cloudformation describe-stacks `
            --stack-name $VpcStackName `
            --region $Region `
            --query 'Stacks[0].Outputs[?OutputKey==`PublicSubnets`].OutputValue' `
            --output text
        
        $PrivateSubnets = aws cloudformation describe-stacks `
            --stack-name $VpcStackName `
            --region $Region `
            --query 'Stacks[0].Outputs[?OutputKey==`PrivateSubnets`].OutputValue' `
            --output text
    }
    catch {
        Write-Error "Failed to get VPC outputs"
        exit 1
    }
    
    # Convert comma-separated strings to space-separated for CloudFormation
    $PublicSubnetList = $PublicSubnets -replace ',', ' '
    $PrivateSubnetList = $PrivateSubnets -replace ',', ' '
    
    # Deploy main stack
    aws cloudformation deploy `
        --template-file aws/cloudformation/main.yaml `
        --stack-name $StackName `
        --parameter-overrides `
            Environment=$Environment `
            DomainName=$DomainName `
            CertificateArn=$CertificateArn `
            VpcId=$VpcId `
            PublicSubnets="$PublicSubnetList" `
            PrivateSubnets="$PrivateSubnetList" `
            OpenAIApiKey=$OpenAIApiKey `
            SupabaseUrl=$SupabaseUrl `
            SupabaseAnonKey=$SupabaseAnonKey `
            GmailUserEmail=$GmailUserEmail `
            GmailClientId=$GmailClientId `
            GmailClientSecret=$GmailClientSecret `
            GmailRefreshToken=$GmailRefreshToken `
        --capabilities CAPABILITY_IAM `
        --region $Region
    
    Write-Success "Application stack deployed"
}

# Function to get deployment outputs
function Get-Outputs {
    Write-Status "Getting deployment outputs..."
    
    try {
        # Get ALB URL
        $AlbUrl = aws cloudformation describe-stacks `
            --stack-name $StackName `
            --region $Region `
            --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerURL`].OutputValue' `
            --output text
        
        # Get HTTPS URL if certificate was provided
        $HttpsUrl = ""
        if ($CertificateArn) {
            $HttpsUrl = aws cloudformation describe-stacks `
                --stack-name $StackName `
                --region $Region `
                --query 'Stacks[0].Outputs[?OutputKey==`HTTPSURL`].OutputValue' `
                --output text
        }
        
        Write-Success "Deployment complete!"
        Write-Host ""
        Write-Host "Deployment Information:" -ForegroundColor Cyan
        Write-Host "======================" -ForegroundColor Cyan
        Write-Host "Environment: $Environment"
        Write-Host "Region: $Region"
        Write-Host "Stack Name: $StackName"
        Write-Host "ALB URL: $AlbUrl"
        
        if ($HttpsUrl) {
            Write-Host "HTTPS URL: $HttpsUrl"
        }
        
        Write-Host ""
        Write-Warning "Note: It may take a few minutes for the ECS service to be fully healthy."
        Write-Warning "You can monitor the deployment in the AWS Console."
    }
    catch {
        Write-Error "Failed to get deployment outputs"
    }
}

# Function to show usage
function Show-Usage {
    Write-Host "Usage: .\deploy.ps1 [-Environment <string>] [-Region <string>] [-DomainName <string>] [-CertificateArn <string>]"
    Write-Host ""
    Write-Host "Parameters:"
    Write-Host "  -Environment     - Environment name (default: production)"
    Write-Host "  -Region         - AWS region (default: us-east-1)"
    Write-Host "  -DomainName     - Domain name for the application (default: portfolio.stevenpennington.com)"
    Write-Host "  -CertificateArn - ARN of SSL certificate (optional)"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\deploy.ps1                                    # Deploy to production in us-east-1"
    Write-Host "  .\deploy.ps1 -Environment staging -Region us-west-2  # Deploy to staging in us-west-2"
    Write-Host "  .\deploy.ps1 -Environment production -DomainName mydomain.com -CertificateArn arn:aws:acm:us-east-1:123456789012:certificate/xxx"
}

# Main deployment function
function Main {
    Write-Host "🚀 AWS ECS Fargate Deployment for Steven Pennington Portfolio" -ForegroundColor Cyan
    Write-Host "=============================================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Check prerequisites
    Test-AwsCli
    Test-Docker
    
    # Deploy infrastructure stacks
    Deploy-Vpc
    Deploy-Ecr
    
    # Build and push Docker image
    Build-And-Push-Image
    
    # Deploy application
    Deploy-Application
    
    # Get outputs
    Get-Outputs
}

# Handle help parameter
if ($args -contains "-h" -or $args -contains "--help") {
    Show-Usage
    exit 0
}

# Run main function
Main 