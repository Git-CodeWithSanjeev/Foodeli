import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getOrders, addToCart } from "../api";
import { CircularProgress, Button as MuiButton } from "@mui/material";
import {
  ShoppingBagOutlined,
  CheckCircleOutline,
  LocalShippingOutlined,
  LocationOnOutlined,
  CalendarTodayOutlined,
  Restaurant,
  DirectionsBike,
  Replay,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/reducers/SnackbarSlice";

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

const Section = styled.div`
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h1`
  font-size: 30px;
  font-weight: 800;
  color: #1c1c1c;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
`;

const OrderCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 18px;
  border: 1px solid #eef0f2;
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
  font-size: 16px;
  font-weight: 800;
  color: #1c1c1c;
`;

const OrderDate = styled.span`
  font-size: 13px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
`;

const StatusBadge = styled.span`
  background: #dcfce7;
  color: #15803d;
  font-size: 12px;
  font-weight: 700;
  padding: 5px 14px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

// Live Progress Tracker Stepper
const StepperTrack = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8f9fa;
  padding: 16px 20px;
  border-radius: 12px;
  position: relative;
  overflow-x: auto;
  gap: 10px;

  @media (max-width: 600px) {
    justify-content: flex-start;
  }
`;

const StepItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: ${({ active }) => (active ? "#e23744" : "#9ca3af")};
  white-space: nowrap;

  svg {
    color: ${({ active }) => (active ? "#e23744" : "#cbd5e1")};
    font-size: 20px;
  }
`;

const StepLine = styled.div`
  flex: 1;
  height: 2px;
  background: ${({ active }) => (active ? "#e23744" : "#e2e8f0")};
  min-width: 30px;
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
  width: 60px;
  height: 60px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid #eee;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ItemName = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #1c1c1c;
`;

const ItemQty = styled.span`
  font-size: 13px;
  color: #6b7280;
`;

const ItemPrice = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #e23744;
`;

const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 14px;
  border-top: 1px solid #f1f3f5;
  flex-wrap: wrap;
  gap: 14px;
`;

const Address = styled.div`
  font-size: 13px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
  max-width: 450px;
`;

const FooterRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const TotalAmount = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: #1c1c1c;
  span {
    color: #e23744;
  }
`;

const ReorderBtn = styled.button`
  background: #ffffff;
  color: #e23744;
  border: 1.5px solid #e23744;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #e23744;
    color: #ffffff;
  }
`;

const EmptyState = styled.div`
  padding: 80px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #6b7280;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
`;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reordering, setReordering] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getEtaText = (createdAt) => {
    if (!createdAt) return "⚡ Delivery ETA: 25-30 mins";
    const elapsedMinutes = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
    const remaining = Math.max(0, 28 - elapsedMinutes);
    if (remaining === 0) return "Arriving any minute now! 🛵";
    return `⚡ Estimated Delivery: ${remaining} mins`;
  };

  const fetchUserOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getOrders();
      setOrders(response.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      if (err.message === "Authentication required") {
        setError("Please sign in to view your order history.");
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

  const handleReorder = async (order) => {
    const products = order.products || [];
    if (!products.length) return;

    try {
      setReordering((prev) => ({ ...prev, [order._id]: true }));
      for (const item of products) {
        const prodId = item.product?._id || item.product;
        if (prodId) {
          await addToCart({ productId: prodId, quantity: item.quantity || 1 });
        }
      }
      dispatch(openSnackbar({ message: "Reordered items added to cart 🎉", severity: "success" }));
      navigate("/cart");
    } catch (err) {
      dispatch(openSnackbar({ message: "Failed to reorder items", severity: "error" }));
    } finally {
      setReordering((prev) => ({ ...prev, [order._id]: false }));
    }
  };

  return (
    <Container>
      <Section>
        <Header>
          <Title>
            <ShoppingBagOutlined style={{ fontSize: "34px", color: "#e23744" }} />
            My Orders
          </Title>
        </Header>

        {loading ? (
          <CircularProgress style={{ margin: "60px auto", color: "#e23744" }} />
        ) : error ? (
          <EmptyState>
            <ShoppingBagOutlined style={{ fontSize: "60px", color: "#9ca3af" }} />
            <div style={{ fontSize: "18px", fontWeight: "600" }}>{error}</div>
            <MuiButton variant="contained" style={{ background: "#e23744" }} onClick={() => navigate("/")}>
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
                  {getEtaText(order.createdAt)}
                </StatusBadge>
              </OrderTop>

              {/* Live Order Progress Tracker */}
              <StepperTrack>
                <StepItem active>
                  <CheckCircleOutline /> Order Placed
                </StepItem>
                <StepLine active />
                <StepItem active>
                  <Restaurant /> Kitchen Preparing
                </StepItem>
                <StepLine />
                <StepItem>
                  <DirectionsBike /> Out for Delivery
                </StepItem>
                <StepLine />
                <StepItem>
                  <CheckCircleOutline /> Delivered
                </StepItem>
              </StepperTrack>

              <ItemList>
                {order.products?.map((item, i) => (
                  <ItemRow key={i}>
                    <ItemImage
                      src={item.product?.img || "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500"}
                      alt={item.product?.name || "Food Item"}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500";
                      }}
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
                <FooterRight>
                  <TotalAmount>
                    Total: <span>₹{order.total_amount || 0}</span>
                  </TotalAmount>
                  <ReorderBtn onClick={() => handleReorder(order)} disabled={reordering[order._id]}>
                    {reordering[order._id] ? <CircularProgress size={16} color="inherit" /> : <><Replay style={{ fontSize: 16 }} /> Reorder</>}
                  </ReorderBtn>
                </FooterRight>
              </OrderFooter>
            </OrderCard>
          ))
        ) : (
          <EmptyState>
            <LocalShippingOutlined style={{ fontSize: "60px", color: "#9ca3af" }} />
            <div style={{ fontSize: "18px", fontWeight: "600" }}>No orders placed yet</div>
            <div style={{ fontSize: "14px" }}>Explore top delivery restaurants and place your first order!</div>
            <MuiButton variant="contained" style={{ background: "#e23744", marginTop: "10px", padding: "10px 24px" }} onClick={() => navigate("/")}>
              Browse Restaurants
            </MuiButton>
          </EmptyState>
        )}
      </Section>
    </Container>
  );
};

export default Orders;
