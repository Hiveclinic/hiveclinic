/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Reset your password — Hive Clinic</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://kyjzjgdcfisuxogledux.supabase.co/storage/v1/object/public/email-assets/logo.png?v=1"
          alt="Hive Clinic"
          width="120"
          style={logo}
        />
        <Hr style={divider} />
        <Heading style={h1}>Reset Your Password</Heading>
        <Text style={text}>
          We received a request to reset your Hive Clinic password. Click below to choose a new one.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Reset Password
        </Button>
        <Text style={subtext}>
          If you didn't request this, your password will remain unchanged.
        </Text>
        <Hr style={divider} />
        <Text style={footer}>
          <Link href="https://hiveclinicuk.com" style={footerLink}>Hive Clinic</Link>
          {' '}· Aesthetics & Skin
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Satoshi', 'Helvetica Neue', Arial, sans-serif" }
const container = { padding: '40px 30px', maxWidth: '480px', margin: '0 auto' }
const logo = { margin: '0 auto 20px', display: 'block' as const }
const divider = { borderColor: '#e8e0d8', margin: '20px 0' }
const h1 = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '26px',
  fontWeight: '500' as const,
  color: '#0d0d0d',
  margin: '0 0 16px',
  textAlign: 'center' as const,
}
const text = {
  fontSize: '14px',
  color: '#666666',
  lineHeight: '1.6',
  margin: '0 0 28px',
  textAlign: 'center' as const,
  letterSpacing: '0.01em',
}
const subtext = {
  fontSize: '12px',
  color: '#999999',
  lineHeight: '1.5',
  margin: '24px 0 0',
  textAlign: 'center' as const,
}
const button = {
  backgroundColor: '#0d0d0d',
  color: '#ffffff',
  fontSize: '13px',
  fontFamily: "'Satoshi', 'Helvetica Neue', Arial, sans-serif",
  letterSpacing: '0.15em',
  textTransform: 'uppercase' as const,
  padding: '14px 32px',
  textDecoration: 'none',
  display: 'block' as const,
  textAlign: 'center' as const,
}
const footer = { fontSize: '11px', color: '#999999', margin: '0', textAlign: 'center' as const, letterSpacing: '0.1em', textTransform: 'uppercase' as const }
const footerLink = { color: '#8b6914', textDecoration: 'none' }
