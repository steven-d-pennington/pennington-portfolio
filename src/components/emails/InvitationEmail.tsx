import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface InvitationEmailProps {
  inviterName: string;
  inviteeName: string;
  role: string;
  companyName?: string;
  acceptUrl: string;
  expiresAt: Date;
}

export default function InvitationEmail({
  inviterName,
  inviteeName,
  role,
  companyName = 'Monkey LoveStack',
  acceptUrl,
  expiresAt,
}: InvitationEmailProps) {
  const roleDisplayName = role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return (
    <Html>
      <Head />
      <Preview>You've been invited to join {companyName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img
              src="https://raw.githubusercontent.com/vercel/vercel/main/packages/cli/assets/vercel.png"
              width="40"
              height="37"
              alt="Monkey LoveStack"
              style={logo}
            />
          </Section>
          
          <Heading style={h1}>You're invited to join {companyName}!</Heading>
          
          <Text style={text}>
            Hello {inviteeName},
          </Text>
          
          <Text style={text}>
            <strong>{inviterName}</strong> has invited you to join <strong>{companyName}</strong> as a <strong>{roleDisplayName}</strong>.
          </Text>
          
          <Text style={text}>
            Click the button below to accept your invitation and create your account:
          </Text>
          
          <Section style={buttonSection}>
            <Button style={button} href={acceptUrl}>
              Accept Invitation
            </Button>
          </Section>
          
          <Text style={text}>
            Or copy and paste this URL into your browser:
          </Text>
          
          <Text style={link}>
            {acceptUrl}
          </Text>
          
          <Text style={footer}>
            This invitation will expire on {expiresAt.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })} at {expiresAt.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}.
          </Text>
          
          <Text style={footer}>
            If you have any questions, please contact support@monkeylovestack.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #eee',
  borderRadius: '5px',
  boxShadow: '0 5px 10px rgba(20,50,70,.2)',
  marginTop: '20px',
  maxWidth: '560px',
  padding: '68px 0 130px',
};

const logoSection = {
  padding: '0 40px',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
};

const h1 = {
  color: '#000',
  fontFamily: 'HelveticaNeue-Medium,Helvetica,Arial,sans-serif',
  fontSize: '20px',
  fontWeight: '500',
  lineHeight: '24px',
  marginBottom: '0',
  marginTop: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#000',
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '16px 40px',
};

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '3px',
  color: '#fff',
  fontFamily: 'HelveticaNeue-Medium,Helvetica,Arial,sans-serif',
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '210px',
  padding: '14px 7px',
};

const link = {
  color: '#3b82f6',
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
  fontSize: '14px',
  textDecoration: 'underline',
  margin: '16px 40px',
  wordBreak: 'break-all' as const,
};

const footer = {
  color: '#898989',
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
  fontSize: '12px',
  lineHeight: '22px',
  margin: '16px 40px',
  marginTop: '32px',
};