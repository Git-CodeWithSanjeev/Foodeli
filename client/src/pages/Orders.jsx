import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getOrders } from "../api";
import { CircularProgress, Button as MuiButton } from "@mui/material";
import { ShoppingBagOutlined, CheckCircleOutline, LocalShippingOutlined, LocationOnOutlined, CalendarTodayOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  padding: 30px;
  padding-bottom: 120px;
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

const Section = styled.div`
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h1`
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary || "#111827"};
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
`;

const OrderCard = styled.div`
  background: ${({ theme }) => theme.card || "#ffffff"};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
`;

const OrderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 14px;
  border-bottom: 1px dashed #e5e7eb;
  flex-wrap: wrap;
  gap: 10px;
`;

const OrderId = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary || "#111827"};
`;

const OrderDate = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.text_secondary || "#6b7280"};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StatusBadge = styled.span`
  background: #dcfce7;
  color: #15803d;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const ItemImage = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 10px;
  object-fit: cover;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ItemName = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary || "#111827"};
`;

const ItemQty = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.text_secondary || "#6b7280"};
`;

const ItemPrice = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.primary || "#eb0029"};
`;

const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 14px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  flex-wrap: wrap;
  gap: 12px;
`;

const Address = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text_secondary || "#6b7280"};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TotalAmount = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary || "#111827"};
  span {
    color: ${({ theme }) => theme.primary || "#eb0029"};
  }
`;

const EmptyState = styled.div`
  padding: 80px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: ${({ theme }) => theme.text_secondary || "#6b7280"};
`;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchUserOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getOrders();
      setOrders(response.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      if (err.message === "Authentication required") {
        setError("Please sign in to view your orders.");
      } else {
        setError("Failed to load orders. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  return (
    <Container>
      <Section>
        <Header>
          <Title>
            <ShoppingBagOutlined style={{ fontSize: "34px", color: "#eb0029" }} />
            My Orders
          </Title>
        </Header>

        {loading ? (
          <CircularProgress style={{ margin: "40px auto", color: "#eb0029" }} />
        ) : error ? (
          <EmptyState>
            <ShoppingBagOutlined style={{ fontSize: "60px", color: "#9ca3af" }} />
            <div style={{ fontSize: "18px", fontWeight: "600" }}>{error}</div>
            <MuiButton variant="contained" style={{ background: "#eb0029" }} onClick={() => navigate("/")}>
              Explore Menu
            </MuiButton>
          </EmptyState>
        ) : orders.length > 0 ? (
          orders.map((order, idx) => (
            <OrderCard key={order._id || idx}>
              <OrderTop>
                <div>
                  <OrderId>Order #{order._id?.substring(0, 10).toUpperCase() || idx + 1}</OrderId>
                  <OrderDate>
                    <CalendarTodayOutlined style={{ fontSize: "13px" }} />
                    {new Date(order.createdAt || Date.now()).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </OrderDate>
                </div>
                <StatusBadge>
                  <CheckCircleOutline style={{ fontSize: "15px" }} />
                  Order Placed
                </StatusBadge>
              </OrderTop>

              <ItemList>
                {order.products?.map((item, i) => (
                  <ItemRow key={i}>
                    <ItemImage
                      src={item.product?.img || "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500"}
                      alt={item.product?.name || "Food Item"}
                    />
                    <ItemInfo>
                      <ItemName>{item.product?.name || "Dish Item"}</ItemName>
                      <ItemQty>Quantity: {item.quantity || 1}</ItemQty>
                    </ItemInfo>
                    <ItemPrice>₹{(item.product?.price?.org || 199) * (item.quantity || 1)}</ItemPrice>
                  </ItemRow>
                ))}
              </ItemList>

              <OrderFooter>
                <Address>
                  <LocationOnOutlined style={{ fontSize: "16px" }} />
                  {order.address || "Standard Delivery Address"}
                </Address>
                <TotalAmount>
                  Total: <span>₹{order.total_amount || 0}</span>
                </TotalAmount>
              </OrderFooter>
            </OrderCard>
          ))
        ) : (
          <EmptyState>
            <LocalShippingOutlined style={{ fontSize: "60px", color: "#9ca3af" }} />
            <div style={{ fontSize: "18px", fontWeight: "600" }}>No orders placed yet.</div>
            <div style={{ fontSize: "14px" }}>Explore our delicious dishes and place your first order!</div>
            <MuiButton variant="contained" style={{ background: "#eb0029", marginTop: "10px" }} onClick={() => navigate("/dishes")}>
              Browse Dishes
            </MuiButton>
          </EmptyState>
        )}
      </Section>
    </Container>
  );
};

export default Orders;
