import React from "react";
import styled from "styled-components";
import { Star, LocationOn, AccessTime, Phone, RestaurantMenu } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Card = styled.div`
  width: 320px;
  background: ${({ theme }) => theme.card || "#ffffff"};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const DistanceTag = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StatusTag = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: #10b981;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  text-transform: uppercase;
`;

const Details = styled.div`
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
`;

const Name = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary || "#111827"};
  margin: 0;
  line-height: 1.3;
`;

const RatingBadge = styled.div`
  background: #fef3c7;
  color: #d97706;
  font-size: 13px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 3px;
  flex-shrink: 0;
`;

const CuisineList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const CuisineBadge = styled.span`
  background: ${({ theme }) => theme.bgLight || "#f3f4f6"};
  color: ${({ theme }) => theme.primary || "#eb0029"};
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
`;

const AddressText = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text_secondary || "#6b7280"};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
  padding-top: 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary || "#6b7280"};
`;

const ActionButton = styled.button`
  width: 100%;
  margin-top: 6px;
  padding: 10px;
  background: ${({ theme }) => theme.primary || "#eb0029"};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: background 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/dishes?search=${encodeURIComponent(restaurant.name)}`);
  };

  return (
    <Card onClick={handleCardClick}>
      <ImageContainer>
        <Image
          src={restaurant.image || restaurant.img || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600"}
          alt={restaurant.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600";
          }}
        />
        <StatusTag>Open Now</StatusTag>
        <DistanceTag>
          <LocationOn style={{ fontSize: "14px" }} />
          {restaurant.distance ? `${restaurant.distance} km` : "1.2 km"}
        </DistanceTag>
      </ImageContainer>

      <Details>
        <Header>
          <Name>{restaurant.name}</Name>
          <RatingBadge>
            <Star style={{ fontSize: "15px" }} />
            {restaurant.rating || 4.5}
          </RatingBadge>
        </Header>

        <CuisineList>
          {restaurant.cuisine?.map((item, idx) => (
            <CuisineBadge key={idx}>{item}</CuisineBadge>
          ))}
        </CuisineList>

        <AddressText>
          <LocationOn style={{ fontSize: "15px", flexShrink: 0 }} />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {restaurant.address}
          </span>
        </AddressText>

        <InfoRow>
          <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <AccessTime style={{ fontSize: "14px" }} />
            {restaurant.deliveryTime || "20-30 mins"}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <Phone style={{ fontSize: "14px" }} />
            {restaurant.contactNumber || "Contact"}
          </span>
        </InfoRow>

        <ActionButton onClick={(e) => { e.stopPropagation(); handleCardClick(); }}>
          <RestaurantMenu style={{ fontSize: "16px" }} />
          Explore Menu
        </ActionButton>
      </Details>
    </Card>
  );
};

export default RestaurantCard;
