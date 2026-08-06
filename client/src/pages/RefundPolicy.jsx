import React from "react";
import styled from "styled-components";
import { AssignmentReturn, CheckCircle, ErrorOutline, AccessTime } from "@mui/icons-material";

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
    padding: 20px;
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
  font-size: 19px;
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

const StepBox = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-top: 15px;
  margin-bottom: 25px;
`;

const StepCard = styled.div`
  background: #f9f9f9;
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid #4caf50;
`;

const StepTitle = styled.h4`
  font-size: 15px;
  font-weight: 600;
  color: #1c1c1c;
  margin-bottom: 6px;
`;

const StepDesc = styled.p`
  font-size: 13px;
  color: #666;
  line-height: 1.5;
`;

const RefundPolicy = () => {
  return (
    <Container>
      <ContentBox>
        <Header>
          <Title>
            <AssignmentReturn style={{ fontSize: "36px", color: "#e23744" }} />
            Cancellation & Refund Policy
          </Title>
          <Subtitle>Transparent policies designed to protect customer satisfaction</Subtitle>
        </Header>

        <Section>
          <SectionHeader>
            <CheckCircle />
            1. 100% Refund Eligibility
          </SectionHeader>
          <Paragraph>
            At Foodeli, customer trust is our top priority. You are entitled to a 100% full refund under the following conditions:
          </Paragraph>
          <StepBox>
            <StepCard>
              <StepTitle>Missing or Damaged Items</StepTitle>
              <StepDesc>If items are missing from your order or damaged in transit, upload a photo in Support for an instant refund.</StepDesc>
            </StepCard>
            <StepCard>
              <StepTitle>Severe Delivery Delays</StepTitle>
              <StepDesc>If your delivery exceeds 60 minutes beyond the promised time due to operational delays, you can request full refund.</StepDesc>
            </StepCard>
            <StepCard>
              <StepTitle>Wrong Item Delivered</StepTitle>
              <StepDesc>If the delivered food differs from what was ordered (e.g. non-veg delivered instead of veg), a 100% refund is initiated immediately.</StepDesc>
            </StepCard>
          </StepBox>
        </Section>

        <Section>
          <SectionHeader>
            <AccessTime />
            2. Refund Processing Timelines
          </SectionHeader>
          <Paragraph>
            Once approved by our support team, refunds are dispatched instantly:
          </Paragraph>
          <ul style={{ paddingLeft: "20px", color: "#4f4f4f", fontSize: "14px", lineHeight: "1.8" }}>
            <li><strong>Foodeli Instant Wallet:</strong> Refund credited within 15 minutes (usable on your next order).</li>
            <li><strong>UPI (Google Pay, PhonePe, Paytm):</strong> 2 to 24 hours.</li>
            <li><strong>Debit / Credit Cards & Netbanking:</strong> 2 to 5 business days depending on your issuing bank.</li>
          </ul>
        </Section>

        <Section>
          <SectionHeader>
            <ErrorOutline />
            3. Cancellation Charges
          </SectionHeader>
          <Paragraph>
            If you cancel an order after the restaurant has accepted and started kitchen preparation, a 100% cancellation fee equal to the order value applies to compensate the restaurant for wasted ingredients.
          </Paragraph>
        </Section>
      </ContentBox>
    </Container>
  );
};

export default RefundPolicy;
