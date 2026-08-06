import React from "react";
import styled from "styled-components";
import { LocalShipping, Speed, VerifiedUser, LocationOn, PhoneInTalk } from "@mui/icons-material";

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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const FeatureCard = styled.div`
  background: #fdfdfd;
  border: 1px solid #f0f0f0;
  padding: 24px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  }
`;

const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: #ffebee;
  color: #e23744;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardTitle = styled.h3`
  font-size: 17px;
  font-weight: 600;
  color: #1c1c1c;
`;

const CardDesc = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #555;
`;

const InfoBox = styled.div`
  background: #fff8f8;
  border-left: 4px solid #e23744;
  padding: 20px;
  border-radius: 8px;
  margin-top: 10px;
`;

const InfoTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #1c1c1c;
  margin-bottom: 6px;
`;

const InfoText = styled.p`
  font-size: 14px;
  color: #4f4f4f;
  line-height: 1.6;
`;

const DeliveryInfo = () => {
  return (
    <Container>
      <ContentBox>
        <Header>
          <Title>
            <LocalShipping style={{ fontSize: "36px", color: "#e23744" }} />
            Delivery Information
          </Title>
          <Subtitle>How we ensure fast, safe, and hygienic food delivery across 40+ cities</Subtitle>
        </Header>

        <Grid>
          <FeatureCard>
            <CardIcon>
              <Speed style={{ fontSize: "28px" }} />
            </CardIcon>
            <CardTitle>30-Minute Guarantee</CardTitle>
            <CardDesc>
              Our smart dispatch system assigns the nearest delivery fleet partner to ensure your food arrives piping hot within 25 to 35 minutes.
            </CardDesc>
          </FeatureCard>

          <FeatureCard>
            <CardIcon>
              <VerifiedUser style={{ fontSize: "28px" }} />
            </CardIcon>
            <CardTitle>Tamper-Evident Seals</CardTitle>
            <CardDesc>
              Every meal package is double-sealed at the restaurant kitchen to guarantee 100% hygiene and zero food contamination in transit.
            </CardDesc>
          </FeatureCard>

          <FeatureCard>
            <CardIcon>
              <LocationOn style={{ fontSize: "28px" }} />
            </CardIcon>
            <CardTitle>Live GPS Tracking</CardTitle>
            <CardDesc>
              Track your rider in real time on the interactive map from restaurant pick-up right to your doorstep.
            </CardDesc>
          </FeatureCard>

          <FeatureCard>
            <CardIcon>
              <PhoneInTalk style={{ fontSize: "28px" }} />
            </CardIcon>
            <CardTitle>Contactless Delivery</CardTitle>
            <CardDesc>
              Request riders to leave your meal at your door, gate, or security counter with photo confirmation.
            </CardDesc>
          </FeatureCard>
        </Grid>

        <InfoBox>
          <InfoTitle>Delivery Fee Structure</InfoTitle>
          <InfoText>
            Standard delivery fees range between ₹15 to ₹45 based on distance from the restaurant. Enjoy <strong>FREE DELIVERY</strong> on orders above ₹299 from Gold Badge restaurants or during special festive promotions!
          </InfoText>
        </InfoBox>
      </ContentBox>
    </Container>
  );
};

export default DeliveryInfo;
