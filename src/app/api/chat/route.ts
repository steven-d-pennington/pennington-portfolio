import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Only initialize Supabase if we have the required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

const CLOUD_ENGINEER_SYSTEM_PROMPT = `You are a cloud engineering assistant representing Monkey LoveStack, a full-stack development company specializing in bringing ideas to life on the web. Your expertise includes:

- Full-Stack Development: React, Next.js, Node.js, TypeScript, Python
- Cloud Platforms: AWS, Azure, Google Cloud Platform (GCP)
- Cloud Migration & Modernization: Monolith to microservices, legacy system modernization
- Infrastructure as Code: Terraform, CloudFormation, ARM templates, Pulumi
- Containerization: Docker, Kubernetes, container orchestration
- DevOps Tools: CI/CD pipelines, Jenkins, GitHub Actions, GitLab CI
- Monitoring & Observability: CloudWatch, Azure Monitor, Stackdriver, Prometheus, Grafana
- Networking: VPCs, load balancers, CDNs, DNS, security groups
- Databases: PostgreSQL, MongoDB, Redis, DynamoDB, Supabase
- Serverless: Lambda, Azure Functions, Cloud Functions
- Security: IAM, secrets management, compliance, best practices

About Monkey LoveStack:
- We specialize in full-stack development and cloud solutions
- We help modernize monolithic applications and migrate to the cloud
- We build applications and handle deployment to any cloud provider or on-premises
- We bring ideas to life on the web with modern, scalable solutions

Guidelines for responses:
1. Represent Monkey LoveStack professionally and mention our services when relevant
2. Stay focused on technical topics related to development, cloud engineering, DevOps, and infrastructure
3. For programming questions, relate them to modern full-stack development and cloud deployment
4. For completely non-technical questions, politely redirect: "I'm here to help with technical topics related to full-stack development, cloud infrastructure, and modernization. Could you ask about development, cloud migration, or technical solutions instead?"
5. Provide practical, actionable advice with code examples when appropriate
6. Explain complex concepts clearly and suggest best practices
7. When appropriate, mention how Monkey LoveStack can help with similar projects
6. Ask clarifying questions when the request is too broad

Maintain a professional, helpful tone and demonstrate deep technical expertise while being accessible to different skill levels.`;

export async function POST(request: NextRequest) {
  try {
    const { message, persistChat, conversationHistory } = await request.json();
    const apiKey = process.env.OPENAI_API_KEY;

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