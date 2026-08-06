import React from "react";
import styled from "styled-components";
import { ShieldOutlined, LockOutlined, VisibilityOutlined } from "@mui/icons-material";

const Container = styled.div`
  padding: 40px 30px;
  padding-bottom: 140px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  background: ${({ theme }) => theme.bg || "#fafafa"};

  @media (max-width: 768px) {
    padding: 20px 14px;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1000px;
  background: ${({ theme }) => theme.card || "#ffffff"};
  border-radius: 16px;
  padding: 36px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h1`
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary || "#111827"};
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: ${({ theme }) => theme.text_primary || "#111827"};
  }
  p {
    margin: 0;
    font-size: 15px;
    line-height: 1.6;
    color: ${({ theme }) => theme.text_secondary || "#4b5563"};
  }
`;

const PrivacyPolicy = () => {
  return (
    <Container>
      <ContentWrapper>
        <Title>
          <ShieldOutlined style={{ fontSize: "36px", color: "#eb0029" }} />
          Privacy Policy
        </Title>
        <p style={{ color: "#6b7280", margin: 0 }}>Last updated: August 2026</p>

        <Section>
          <h3>1. Information We Collect</h3>
          <p>
            When you use Foodeli, we collect personal information such as your name, email address, phone number, delivery addresses, and payment details to fulfill food delivery orders.
          </p>
        </Section>

        <Section>
          <h3>2. How We Use Your Data</h3>
          <p>
            Your information is used strictly to process orders, assign food couriers, send order status updates, provide customer support, and improve user recommendations.
          </p>
        </Section>

        <Section>
          <h3>3. Location & Geolocation Data</h3>
          <p>
            With your permission, we use your location coordinates to detect nearby restaurants and estimate accurate delivery arrival times. You can enable or disable location permissions in your browser at any time.
          </p>
        </Section>

        <Section>
          <h3>4. Data Protection & Security</h3>
          <p>
            We enforce industry-standard SSL encryption and secure JWT authentication to protect your account and personal data from unauthorized access.
          </p>
        </Section>
      </ContentWrapper>
    </Container>
  );
};

export default PrivacyPolicy;
