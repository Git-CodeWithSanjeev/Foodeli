import React from "react";
import styled from "styled-components";
import { RestaurantMenu, LocalShipping, HighQuality, Speed, Group } from "@mui/icons-material";

const Container = styled.div`
  padding: 40px 30px;
  padding-bottom: 140px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  background: ${({ theme }) => theme.bg || "#fafafa"};

  @media (max-width: 768px) {
    padding: 20px 14px;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const HeroTitle = styled.h1`
  font-size: 36px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary || "#111827"};
  margin: 0;
  span {
    color: #eb0029;
  }
`;

const LeadText = styled.p`
  font-size: 18px;
  line-height: 1.6;
  color: ${({ theme }) => theme.text_secondary || "#4b5563"};
  margin: 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  margin-top: 10px;
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.card || "#ffffff"};
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 14px;
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const IconBox = styled.div`
  background: #fef2f2;
  color: #eb0029;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: ${({ theme }) => theme.text_primary || "#111827"};
`;

const CardDesc = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.text_secondary || "#6b7280"};
  margin: 0;
`;

const About = () => {
  return (
    <Container>
      <ContentWrapper>
        <HeroTitle>
          Delivering Happiness, <span>One Meal at a Time</span>
        </HeroTitle>
        <LeadText>
          Welcome to Foodeli! We connect hungry food lovers with top-rated local restaurants and eateries. Our mission is to deliver fresh, hot, and delicious food straight to your doorstep with unmatched speed and reliability.
        </LeadText>

        <Grid>
          <FeatureCard>
            <IconBox>
              <Speed style={{ fontSize: "28px" }} />
            </IconBox>
            <CardTitle>Ultra-Fast Delivery</CardTitle>
            <CardDesc>Real-time order tracking and optimized routing ensure your meals arrive piping hot in 30 minutes or less.</CardDesc>
          </FeatureCard>

          <FeatureCard>
            <IconBox>
              <HighQuality style={{ fontSize: "28px" }} />
            </IconBox>
            <CardTitle>Top Restaurant Partners</CardTitle>
            <CardDesc>We partner exclusively with verified kitchen hygiene standards to serve gourmet, fresh quality meals.</CardDesc>
          </FeatureCard>

          <FeatureCard>
            <IconBox>
              <RestaurantMenu style={{ fontSize: "28px" }} />
            </IconBox>
            <CardTitle>Diverse Cuisine Selection</CardTitle>
            <CardDesc>From authentic Indian Biryani to wood-fired Italian Pizzas and artisan burgers, enjoy endless dining choices.</CardDesc>
          </FeatureCard>

          <FeatureCard>
            <IconBox>
              <Group style={{ fontSize: "28px" }} />
            </IconBox>
            <CardTitle>24/7 Dedicated Support</CardTitle>
            <CardDesc>Our friendly customer care team is always here to ensure your food ordering experience is seamless and satisfying.</CardDesc>
          </FeatureCard>
        </Grid>
      </ContentWrapper>
    </Container>
  );
};

export default About;
