import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Only initialize Supabase if we have the required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: any = null;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

const CLOUD_ENGINEER_SYSTEM_PROMPT = `You are a highly experienced cloud engineering assistant specializing in cloud infrastructure, DevOps, and technical solutions. Your expertise includes:

- Cloud Platforms: AWS, Azure, Google Cloud Platform (GCP)
- Infrastructure as Code: Terraform, CloudFormation, ARM templates, Pulumi
- Containerization: Docker, Kubernetes, container orchestration
- DevOps Tools: CI/CD pipelines, Jenkins, GitHub Actions, GitLab CI
- Monitoring & Observability: CloudWatch, Azure Monitor, Stackdriver, Prometheus, Grafana
- Networking: VPCs, load balancers, CDNs, DNS, security groups
- Databases: RDS, DynamoDB, Azure SQL, Cloud SQL, MongoDB Atlas
- Serverless: Lambda, Azure Functions, Cloud Functions
- Security: IAM, secrets management, compliance, best practices

Guidelines for responses:
1. Stay focused on technical topics related to cloud engineering, DevOps, and infrastructure
2. For programming questions, relate them to cloud/infrastructure context when possible
3. For completely non-technical questions, politely redirect: "I'm specialized in cloud engineering and technical topics. Could you ask about cloud infrastructure, DevOps, or technical solutions instead?"
4. Provide practical, actionable advice with code examples when appropriate
5. Explain complex concepts clearly and suggest best practices
6. Ask clarifying questions when the request is too broad

Maintain a professional, helpful tone and demonstrate deep technical expertise while being accessible to different skill levels.`;

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export async function POST(request: NextRequest) {
  try {
    const { message, persistChat, conversationHistory } = await request.json();
    const apiKey = process.env.NEXT_OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured.' }, { status: 500 });
    }

    if (!message) {
      return NextResponse.json({ error: 'No message provided.' }, { status: 400 });
    }

    // Build conversation context
    const messages = [
      { role: 'system', content: CLOUD_ENGINEER_SYSTEM_PROMPT },
    ];

    // Add conversation history for context (last 10 messages)
    if (conversationHistory && Array.isArray(conversationHistory)) {
      const recentHistory = conversationHistory
        .slice(-10) // Keep last 10 messages
        .filter(msg => msg.role !== 'system') // Exclude system messages
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));
      messages.push(...recentHistory);
    }

    // Add current message
    messages.push({ role: 'user', content: message });

    console.log('Sending request to OpenAI with', messages.length, 'messages');

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!openaiRes.ok) {
      const error = await openaiRes.text();
      console.error('OpenAI API error:', error);
      return NextResponse.json({ error: 'Failed to get response from AI assistant' }, { status: openaiRes.status });
    }

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content || '';

    // Save to Supabase if persistChat is enabled and Supabase is available
    if (persistChat && reply && supabase) {
      try {
        const { error: dbError } = await supabase
          .from('chat_conversations')
          .insert({
            user_message: message,
            assistant_response: reply,
            created_at: new Date().toISOString(),
          });

        if (dbError) {
          console.error('Error saving to Supabase:', dbError);
          // Don't fail the request if DB save fails
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Don't fail the request if DB save fails
      }
    } else if (persistChat && !supabase) {
      console.warn('Persist chat requested but Supabase not configured');
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
} 