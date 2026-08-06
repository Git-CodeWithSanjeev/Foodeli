import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Card = styled.div`
  width: 250px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.3s ease-out;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }

  @media (max-width: 600px) {
    width: 170px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 320px;
  border-radius: 12px;
  object-fit: cover;
  transition: all 0.3s ease-out;
  @media (max-width: 600px) {
    height: 230px;
  }
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease-out;
  &:hover ${Image} {
    transform: scale(1.05);
  }
`;

const Menu = styled.div`
  width: 100%;
  position: absolute;
  z-index: 10;
  color: ${({ theme }) => theme.text_primary};
  bottom: 0px;
  left: 0;
  right: 0;
  display: flex;
`;

const Button = styled.div`
  width: 100%;
  color: white;
  padding: 16px 20px;
  text-align: center;
  font-weight: 700;
  font-size: 16px;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.85) 30%,
    transparent
  );
  @media (max-width: 600px) {
    padding: 10px 14px;
    font-size: 14px;
  }
`;

const Sale = styled.div`
  position: absolute;
  z-index: 10;
  top: 12px;
  right: 12px;
  font-size: 12px;
  font-weight: 700;
  color: white;
  background: #10b981;
  padding: 4px 8px;
  border-radius: 6px;
  @media (max-width: 600px) {
    font-size: 10px;
  }
`;

const ProductCategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/dishes?search=${encodeURIComponent(category.name)}`);
  };

  return (
    <Card onClick={handleClick}>
      <Top>
        <Image src={category.img} alt={category.name} />
        <Menu>
          <Button>{category.name}</Button>
        </Menu>
        {category.off && <Sale>{category.off}</Sale>}
      </Top>
    </Card>
  );
};

export default ProductCategoryCard;
