import React from "react";
import styled from "styled-components";
import { Gavel, Description, Security, Payment, LocalShipping, HelpOutline } from "@mui/icons-material";

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
    padding: 20px 15px 120px 15px;
  }
`;

const ContentBox = styled.div`
  width: 100%;
  max-width: 900px;
  background: #ffffff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 35px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1c1c1c;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: #696969;
  margin-top: 8px;
`;

const Section = styled.div`
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionHeader = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1c1c1c;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;

  svg {
    color: #e23744;
  }
`;

const Paragraph = styled.p`
  font-size: 14px;
  line-height: 1.7;
  color: #4f4f4f;
  margin-bottom: 10px;
`;

const BulletList = styled.ul`
  padding-left: 20px;
  margin-bottom: 10px;
`;

const BulletItem = styled.li`
  font-size: 14px;
  line-height: 1.7;
  color: #4f4f4f;
  margin-bottom: 6px;
`;

const TermsConditions = () => {
  return (
    <Container>
      <ContentBox>
        <Header>
          <Title>
            <Gavel style={{ fontSize: "36px", color: "#e23744" }} />
            Terms & Conditions
          </Title>
          <Subtitle>Last updated: August 2026</Subtitle>
        </Header>

        <Section>
          <SectionHeader>
            <Description />
            1. Introduction & Agreement
          </SectionHeader>
          <Paragraph>
            Welcome to Foodeli. By accessing or using our mobile application, website, or services, you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our platform.
          </Paragraph>
          <Paragraph>
            Foodeli operates as an online food ordering and delivery marketplace connecting customers with partner restaurants and independent delivery fleet partners across India.
          </Paragraph>
        </Section>

        <Section>
          <SectionHeader>
            <Security />
            2. User Account & Security
          </SectionHeader>
          <BulletList>
            <BulletItem>You must be at least 18 years of age or using the service under parental supervision.</BulletItem>
            <BulletItem>You are responsible for maintaining the confidentiality of your account credentials and password.</BulletItem>
            <BulletItem>Foodeli reserves the right to suspend or terminate accounts engaging in fraudulent activity, fake orders, or abuse of discount promo codes.</BulletItem>
          </BulletList>
        </Section>

        <Section>
          <SectionHeader>
            <Payment />
            3. Pricing, Orders & Payments
          </SectionHeader>
          <Paragraph>
            All prices displayed on Foodeli are set by our partner restaurants and are inclusive of applicable taxes unless stated otherwise. Delivery fees, small order charges, and platform fees are calculated at checkout.
          </Paragraph>
          <BulletList>
            <BulletItem>Payment can be made via UPI, Debit/Credit Cards, Netbanking, Digital Wallets, or Cash on Delivery (COD).</BulletItem>
            <BulletItem>Once an order is confirmed by the restaurant, modifications or cancellations are subject to our Refund Policy.</BulletItem>
          </BulletList>
        </Section>

        <Section>
          <SectionHeader>
            <LocalShipping />
            4. Delivery & Food Hygiene
          </SectionHeader>
          <Paragraph>
            Delivery times estimated on the platform are approximate and may vary due to weather, traffic, or peak preparation hours at restaurants.
          </Paragraph>
          <BulletList>
            <BulletItem>Restaurants are solely responsible for food quality, preparation, and hygiene compliance under FSSAI guidelines.</BulletItem>
            <BulletItem>Foodeli delivery partners ensure tamper-evident sealed packaging during transit.</BulletItem>
          </BulletList>
        </Section>

        <Section>
          <SectionHeader>
            <HelpOutline />
            5. Contact Information
          </SectionHeader>
          <Paragraph>
            For any queries or legal concerns regarding these Terms & Conditions, please contact our support team at <strong>legal@foodeli.com</strong> or call <strong>+91 1800-123-FOOD</strong>.
          </Paragraph>
        </Section>
      </ContentBox>
    </Container>
  );
};

export default TermsConditions;
