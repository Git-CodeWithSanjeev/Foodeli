import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const LogoLink = styled(Link)`
  font-size: ${({ size }) => size || "32px"};
  font-weight: 900;
  color: #e23744;
  text-decoration: none;
  font-style: italic;
  letter-spacing: -1.5px;
  font-family: 'Poppins', 'Outfit', sans-serif;
  display: inline-flex;
  align-items: center;
  user-select: none;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.04);
    color: #d02e3b;
  }
`;

const BrandLogo = ({ size, to = "/" }) => {
  return <LogoLink to={to} size={size}>foodeli</LogoLink>;
};

export default BrandLogo;
