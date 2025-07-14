#!/bin/bash

# AWS ECS Fargate Deployment Script for Steven Pennington Portfolio
# This script deploys the portfolio to AWS ECS Fargate using CloudFormation

set -e

# Configuration
ENVIRONMENT=${1:-production}
REGION=${2:-us-east-1}
STACK_NAME="pennington-portfolio-${ENVIRONMENT}"
VPC_STACK_NAME="pennington-portfolio-vpc-${ENVIRONMENT}"
ECR_STACK_NAME="pennington-portfolio-ecr-${ENVIRONMENT}"
DOMAIN_NAME=${3:-portfolio.stevenpennington.com}
CERTIFICATE_ARN=${4:-""}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if AWS CLI is installed and configured
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS CLI is not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    print_success "AWS CLI is configured"
}

# Function to check if Docker is installed and running
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install it first."
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    
    print_success "Docker is running"
}

# Function to build and push Docker image
build_and_push_image() {
    print_status "Building Docker image..."
    
    # Get ECR repository URI
    ECR_REPO_URI=$(aws cloudformation describe-stacks \
        --stack-name $ECR_STACK_NAME \
        --region $REGION \
        --query 'Stacks[0].Outputs[?OutputKey==`RepositoryUri`].OutputValue' \
        --output text 2>/dev/null || echo "")
    
    if [ -z "$ECR_REPO_URI" ]; then
        print_error "ECR repository not found. Please deploy ECR stack first."
        exit 1
    fi
    
    # Build image
    docker build -t pennington-portfolio .
    
    # Tag image
    docker tag pennington-portfolio:latest $ECR_REPO_URI:latest
    
    # Login to ECR
    aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_REPO_URI
    
    # Push image
    docker push $ECR_REPO_URI:latest
    
    print_success "Docker image pushed to ECR"
}

# Function to deploy VPC stack
deploy_vpc() {
    print_status "Deploying VPC stack..."
    
    aws cloudformation deploy \
        --template-file aws/cloudformation/vpc.yaml \
        --stack-name $VPC_STACK_NAME \
        --parameter-overrides \
            Environment=$ENVIRONMENT \
        --capabilities CAPABILITY_IAM \
        --region $REGION
    
    print_success "VPC stack deployed"
}

# Function to deploy ECR stack
deploy_ecr() {
    print_status "Deploying ECR stack..."
    
    aws cloudformation deploy \
        --template-file aws/cloudformation/ecr.yaml \
        --stack-name $ECR_STACK_NAME \
        --parameter-overrides \
            Environment=$ENVIRONMENT \
        --capabilities CAPABILITY_IAM \
        --region $REGION
    
    print_success "ECR stack deployed"
}

# Function to deploy main application stack
deploy_application() {
    print_status "Deploying application stack..."
    
    # Get VPC outputs
    VPC_ID=$(aws cloudformation describe-stacks \
        --stack-name $VPC_STACK_NAME \
        --region $REGION \
        --query 'Stacks[0].Outputs[?OutputKey==`VpcId`].OutputValue' \
        --output text)
    
    PUBLIC_SUBNETS=$(aws cloudformation describe-stacks \
        --stack-name $VPC_STACK_NAME \
        --region $REGION \
        --query 'Stacks[0].Outputs[?OutputKey==`PublicSubnets`].OutputValue' \
        --output text)
    
    PRIVATE_SUBNETS=$(aws cloudformation describe-stacks \
        --stack-name $VPC_STACK_NAME \
        --region $REGION \
        --query 'Stacks[0].Outputs[?OutputKey==`PrivateSubnets`].OutputValue' \
        --output text)
    
    # Convert comma-separated strings to space-separated for CloudFormation
    PUBLIC_SUBNET_LIST=$(echo $PUBLIC_SUBNETS | tr ',' ' ')
    PRIVATE_SUBNET_LIST=$(echo $PRIVATE_SUBNETS | tr ',' ' ')
    
    # Deploy main stack
    aws cloudformation deploy \
        --template-file aws/cloudformation/main.yaml \
        --stack-name $STACK_NAME \
        --parameter-overrides \
            Environment=$ENVIRONMENT \
            DomainName=$DOMAIN_NAME \
            CertificateArn=$CERTIFICATE_ARN \
            VpcId=$VPC_ID \
            PublicSubnets="$PUBLIC_SUBNET_LIST" \
            PrivateSubnets="$PRIVATE_SUBNET_LIST" \
        --capabilities CAPABILITY_IAM \
        --region $REGION
    
    print_success "Application stack deployed"
}

# Function to get deployment outputs
get_outputs() {
    print_status "Getting deployment outputs..."
    
    # Get ALB URL
    ALB_URL=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --region $REGION \
        --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerURL`].OutputValue' \
        --output text)
    
    # Get HTTPS URL if certificate was provided
    if [ -n "$CERTIFICATE_ARN" ]; then
        HTTPS_URL=$(aws cloudformation describe-stacks \
            --stack-name $STACK_NAME \
            --region $REGION \
            --query 'Stacks[0].Outputs[?OutputKey==`HTTPSURL`].OutputValue' \
            --output text)
    fi
    
    print_success "Deployment complete!"
    echo ""
    echo "Deployment Information:"
    echo "======================"
    echo "Environment: $ENVIRONMENT"
    echo "Region: $REGION"
    echo "Stack Name: $STACK_NAME"
    echo "ALB URL: $ALB_URL"
    
    if [ -n "$HTTPS_URL" ]; then
        echo "HTTPS URL: $HTTPS_URL"
    fi
    
    echo ""
    print_warning "Note: It may take a few minutes for the ECS service to be fully healthy."
    print_warning "You can monitor the deployment in the AWS Console."
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [ENVIRONMENT] [REGION] [DOMAIN_NAME] [CERTIFICATE_ARN]"
    echo ""
    echo "Parameters:"
    echo "  ENVIRONMENT     - Environment name (default: production)"
    echo "  REGION         - AWS region (default: us-east-1)"
    echo "  DOMAIN_NAME    - Domain name for the application (default: portfolio.stevenpennington.com)"
    echo "  CERTIFICATE_ARN - ARN of SSL certificate (optional)"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Deploy to production in us-east-1"
    echo "  $0 staging us-west-2                  # Deploy to staging in us-west-2"
    echo "  $0 production us-east-1 mydomain.com arn:aws:acm:us-east-1:123456789012:certificate/xxx"
}

# Main deployment function
main() {
    echo "🚀 AWS ECS Fargate Deployment for Steven Pennington Portfolio"
    echo "============================================================="
    echo ""
    
    # Check prerequisites
    check_aws_cli
    check_docker
    
    # Deploy infrastructure stacks
    deploy_vpc
    deploy_ecr
    
    # Build and push Docker image
    build_and_push_image
    
    # Deploy application
    deploy_application
    
    # Get outputs
    get_outputs
}

# Handle command line arguments
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_usage
    exit 0
fi

# Run main function
main 