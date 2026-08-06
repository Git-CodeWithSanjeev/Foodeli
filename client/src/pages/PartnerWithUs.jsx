import React, { useState } from "react";
import styled from "styled-components";
import { TrendingUp, AccountBalanceWallet, Speed, Send } from "@mui/icons-material";
import { Snackbar, Alert } from "@mui/material";

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
    padding: 20px 15px 120px 15px;
  }
`;

const HeroBanner = styled.div`
  width: 100%;
  max-width: 1000px;
  background: linear-gradient(135deg, #1c1c1c 0%, #2d1115 100%);
  color: #ffffff;
  padding: 50px 40px;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 30px 20px;
    text-align: center;
  }
`;

const HeroText = styled.div`
  flex: 1;
`;

const HeroBadge = styled.span`
  background: #e23744;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const HeroTitle = styled.h1`
  font-size: 34px;
  font-weight: 800;
  margin-top: 15px;
  margin-bottom: 12px;
  line-height: 1.2;
`;

const HeroSub = styled.p`
  font-size: 16px;
  color: #ddd;
  line-height: 1.6;
`;

const ContentBox = styled.div`
  width: 100%;
  max-width: 1000px;
  background: #ffffff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #1c1c1c;
  text-align: center;
  margin-bottom: 30px;
`;

const BenefitGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const BenefitCard = styled.div`
  background: #fdfdfd;
  border: 1px solid #eee;
  padding: 24px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const IconCircle = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: #ffebee;
  color: #e23744;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BenefitTitle = styled.h3`
  font-size: 17px;
  font-weight: 600;
  color: #1c1c1c;
`;

const BenefitDesc = styled.p`
  font-size: 14px;
  color: #555;
  line-height: 1.6;
`;

const FormBox = styled.div`
  background: #fdf8f8;
  border: 1px solid #fce8e8;
  padding: 35px;
  border-radius: 16px;
`;

const FormTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1c1c1c;
  margin-bottom: 8px;
`;

const FormSub = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 25px;
`;

const FormGrid = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Input = styled.input`
  padding: 14px 18px;
  border-radius: 10px;
  border: 1px solid #ddd;
  font-size: 14px;
  outline: none;
  &:focus {
    border-color: #e23744;
  }
`;

const SubmitBtn = styled.button`
  grid-column: span 2;
  background: #e23744;
  color: #ffffff;
  border: none;
  padding: 16px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s ease;

  &:hover {
    background: #d02e3b;
  }

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const PartnerWithUs = () => {
  const [formData, setFormData] = useState({
    restaurantName: "",
    ownerName: "",
    phone: "",
    city: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.restaurantName || !formData.phone) return;
    setSubmitted(true);
    setFormData({ restaurantName: "", ownerName: "", phone: "", city: "" });
  };

  return (
    <Container>
      <HeroBanner>
        <HeroText>
          <HeroBadge>Merchant Partner Network</HeroBadge>
          <HeroTitle>Grow your restaurant business 3x with Foodeli</HeroTitle>
          <HeroSub>
            Join 10,000+ restaurant partners serving millions of hungry customers across 40+ Indian cities every day.
          </HeroSub>
        </HeroText>
      </HeroBanner>

      <ContentBox>
        <SectionTitle>Why Partner with Foodeli?</SectionTitle>
        <BenefitGrid>
          <BenefitCard>
            <IconCircle>
              <TrendingUp style={{ fontSize: "28px" }} />
            </IconCircle>
            <BenefitTitle>3x Higher Order Volumes</BenefitTitle>
            <BenefitDesc>
              Reach millions of active foodies in your city and boost your daily kitchen sales with targeted in-app promotions.
            </BenefitDesc>
          </BenefitCard>

          <BenefitCard>
            <IconCircle>
              <AccountBalanceWallet style={{ fontSize: "28px" }} />
            </IconCircle>
            <BenefitTitle>Instant Weekly Payouts</BenefitTitle>
            <BenefitDesc>
              Receive automated weekly payouts straight to your bank account with transparent commission rates & zero hidden fees.
            </BenefitDesc>
          </BenefitCard>

          <BenefitCard>
            <IconCircle>
              <Speed style={{ fontSize: "28px" }} />
            </IconCircle>
            <BenefitTitle>Smart Merchant App</BenefitTitle>
            <BenefitDesc>
              Manage live menus, toggle dish availability, track delivery riders, and view real-time revenue analytics.
            </BenefitDesc>
          </BenefitCard>
        </BenefitGrid>

        <FormBox>
          <FormTitle>Register Your Restaurant Today</FormTitle>
          <FormSub>Fill in your details below and our partnership manager will contact you within 24 hours.</FormSub>
          <FormGrid onSubmit={handleSubmit}>
            <Input
              placeholder="Restaurant Name *"
              required
              value={formData.restaurantName}
              onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
            />
            <Input
              placeholder="Owner Name"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
            />
            <Input
              placeholder="Mobile Phone Number *"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              placeholder="City (e.g. Lucknow, Prayagraj, Delhi)"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
            <SubmitBtn type="submit">
              <Send /> Submit Partner Lead
            </SubmitBtn>
          </FormGrid>
        </FormBox>
      </ContentBox>

      <Snackbar
        open={submitted}
        autoHideDuration={6000}
        onClose={() => setSubmitted(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSubmitted(false)} severity="success" sx={{ width: "100%" }}>
          🎉 Thank you! Your restaurant partnership request has been submitted successfully.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PartnerWithUs;
