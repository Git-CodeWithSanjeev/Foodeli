import React, { useState } from "react";
import styled from "styled-components";
import { HelpOutline, ExpandMore, Search, LocalShipping, Payment, Cancel, AccountCircle } from "@mui/icons-material";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";

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
  margin-bottom: 30px;
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

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: #f4f4f4;
  padding: 12px 20px;
  border-radius: 30px;
  margin-bottom: 35px;
  gap: 10px;
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  width: 100%;
  font-size: 15px;
  outline: none;
  color: #1c1c1c;
`;

const CategoryHeader = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1c1c1c;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 25px;
  margin-bottom: 15px;

  svg {
    color: #e23744;
  }
`;

const AnswerText = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #4f4f4f;
`;

const FAQ_DATA = [
  {
    category: "Ordering & Live Tracking",
    icon: <LocalShipping />,
    questions: [
      {
        q: "How do I track my food order live?",
        a: "Once your order is confirmed, go to the 'Orders' tab in your profile or click 'Track Order' in the header. You can view real-time updates on kitchen preparation, delivery partner assignment, and live GPS map tracking."
      },
      {
        q: "Can I schedule an order for later?",
        a: "Yes! At checkout, select 'Schedule Order' to pick a custom delivery time window up to 24 hours in advance."
      },
      {
        q: "What is the minimum order amount?",
        a: "Minimum order values are set by individual restaurants. Many top restaurants offer free delivery on orders above ₹299."
      }
    ]
  },
  {
    category: "Payments & Discount Promo Codes",
    icon: <Payment />,
    questions: [
      {
        q: "What payment methods are supported on Foodeli?",
        a: "We accept UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards (Visa, Mastercard, RuPay), Netbanking, Paytm Wallet, Simpl PayLater, and Cash on Delivery (COD)."
      },
      {
        q: "How do I apply a discount coupon?",
        a: "On the Cart page before placing your order, tap 'Apply Promo Code' to select available discounts like 50% OFF, FLAT ₹125 OFF, or free delivery codes."
      }
    ]
  },
  {
    category: "Cancellations & Refunds",
    icon: <Cancel />,
    questions: [
      {
        q: "Can I cancel my order after placing it?",
        a: "You can cancel your order within 60 seconds of placing it without any charge. After 60 seconds, cancellations depend on whether the restaurant has started kitchen preparation."
      },
      {
        q: "How long does a refund take?",
        a: "Online paid refunds (UPI/Card/Netbanking) are processed instantly back to your original payment method or Foodeli Wallet within 15 minutes to 2 business days depending on your bank."
      }
    ]
  },
  {
    category: "Account & Profile",
    icon: <AccountCircle />,
    questions: [
      {
        q: "How do I update my delivery address?",
        a: "You can manage saved home, work, and custom delivery addresses under your Profile settings or directly at checkout."
      }
    ]
  }
];

const FAQs = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Container>
      <ContentBox>
        <Header>
          <Title>
            <HelpOutline style={{ fontSize: "36px", color: "#e23744" }} />
            Frequently Asked Questions
          </Title>
          <Subtitle>Find instant answers to common questions about ordering, payments & delivery</Subtitle>
        </Header>

        <SearchBar>
          <Search style={{ color: "#777" }} />
          <SearchInput
            placeholder="Search FAQs (e.g. refund, tracking, payment)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>

        {FAQ_DATA.map((cat, catIdx) => {
          const filteredQ = cat.questions.filter(
            (item) =>
              item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.a.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (filteredQ.length === 0) return null;

          return (
            <div key={catIdx}>
              <CategoryHeader>
                {cat.icon}
                {cat.category}
              </CategoryHeader>
              {filteredQ.map((item, qIdx) => (
                <Accordion key={qIdx} style={{ borderRadius: "8px", marginBottom: "8px", boxShadow: "none", border: "1px solid #eee" }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <strong style={{ fontSize: "15px", color: "#222" }}>{item.q}</strong>
                  </AccordionSummary>
                  <AccordionDetails>
                    <AnswerText>{item.a}</AnswerText>
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          );
        })}
      </ContentBox>
    </Container>
  );
};

export default FAQs;
