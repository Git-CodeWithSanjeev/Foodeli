import React, { useState } from "react";
import styled from "styled-components";
import { MailOutline, PhoneOutlined, LocationOnOutlined, Send, CheckCircleOutline } from "@mui/icons-material";
import { Alert, Snackbar } from "@mui/material";

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
  max-width: 1200px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;

  @media (max-width: 868px) {
    grid-template-columns: 1fr;
  }
`;

const HeaderSection = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary || "#111827"};
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary || "#6b7280"};
  margin: 0;
`;

const InfoCard = styled.div`
  background: ${({ theme }) => theme.card || "#ffffff"};
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

const IconWrapper = styled.div`
  background: #fef2f2;
  color: #eb0029;
  padding: 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InfoText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  h4 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: ${({ theme }) => theme.text_primary || "#111827"};
  }
  p {
    margin: 0;
    font-size: 14px;
    color: ${({ theme }) => theme.text_secondary || "#6b7280"};
  }
`;

const FormCard = styled.form`
  background: ${({ theme }) => theme.card || "#ffffff"};
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  label {
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.text_primary || "#111827"};
  }
  input, textarea {
    padding: 12px 16px;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    outline: none;
    font-size: 14px;
    font-family: inherit;
    transition: border-color 0.2s ease;
    &:focus {
      border-color: #eb0029;
    }
  }
  textarea {
    resize: vertical;
    min-height: 120px;
  }
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.primary || "#eb0029"};
  color: white;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    if (!formData.email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Container>
      <HeaderSection>
        <Title>Get In Touch</Title>
        <Subtitle>Have a question or feedback? We'd love to hear from you!</Subtitle>
      </HeaderSection>

      <ContentWrapper>
        <InfoCard>
          <InfoItem>
            <IconWrapper>
              <LocationOnOutlined />
            </IconWrapper>
            <InfoText>
              <h4>Our Headquarters</h4>
              <p>123 Foodeli Plaza, Tech Avenue, Innovation City</p>
            </InfoText>
          </InfoItem>

          <InfoItem>
            <IconWrapper>
              <MailOutline />
            </IconWrapper>
            <InfoText>
              <h4>Email Support</h4>
              <p>support@foodeli.com | info@foodeli.com</p>
            </InfoText>
          </InfoItem>

          <InfoItem>
            <IconWrapper>
              <PhoneOutlined />
            </IconWrapper>
            <InfoText>
              <h4>Phone Line</h4>
              <p>+1 (800) 234-FOOD | Mon - Sun (24/7 Support)</p>
            </InfoText>
          </InfoItem>
        </InfoCard>

        <FormCard onSubmit={handleSubmit}>
          <InputGroup>
            <label>Your Name *</label>
            <input
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </InputGroup>

          <InputGroup>
            <label>Email Address *</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </InputGroup>

          <InputGroup>
            <label>Subject</label>
            <input
              type="text"
              placeholder="How can we help?"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
          </InputGroup>

          <InputGroup>
            <label>Message *</label>
            <textarea
              placeholder="Type your message here..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </InputGroup>

          <SubmitButton type="submit">
            <Send style={{ fontSize: "18px" }} />
            Send Message
          </SubmitButton>
        </FormCard>
      </ContentWrapper>

      <Snackbar open={submitted} autoHideDuration={5000} onClose={() => setSubmitted(false)}>
        <Alert severity="success" onClose={() => setSubmitted(false)}>
          Thank you! Your message has been received. Our team will contact you shortly.
        </Alert>
      </Snackbar>

      <Snackbar open={Boolean(errorMsg)} autoHideDuration={4000} onClose={() => setErrorMsg("")}>
        <Alert severity="error" onClose={() => setErrorMsg("")}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Contact;
