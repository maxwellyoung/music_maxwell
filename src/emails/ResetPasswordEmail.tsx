/* eslint-disable */
// @ts-nocheck
import { Html, Body, Container, Text, Link } from "@react-email/components";

export default function ResetPasswordEmail({ url }: { url: string }) {
  return (
    <Html>
      <Body
        style={{
          background: "#111",
          color: "#eee",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <Container style={{ padding: "24px" }}>
          <Text style={{ fontSize: "18px", marginBottom: "16px" }}>
            Forgot your password?
          </Text>
          <Text style={{ marginBottom: "24px" }}>
            Click the magic link below within 30 minutes to set a new one.
          </Text>
          <Link
            href={url}
            style={{
              background: "#6366f1",
              padding: "12px 20px",
              color: "#fff",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            Reset password
          </Link>
          <Text style={{ marginTop: "32px", fontSize: "12px", opacity: 0.6 }}>
            If you didn't request this, just ignore me—nothing changes.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
