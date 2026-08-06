import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { logout, loginSuccess } from "../redux/reducers/UserSlice";
import { useNavigate } from "react-router-dom";
import {
  Person,
  ShoppingBag,
  Favorite,
  LocationOn,
  ExitToApp,
  CheckCircle,
  Edit,
  Save,
  Email,
  Phone,
} from "@mui/icons-material";
import { Avatar, CircularProgress } from "@mui/material";
import { openSnackbar } from "../redux/reducers/SnackbarSlice";
import ZomatoHeader from "../components/ZomatoHeader";
import Footer from "../components/Footer";

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #fafafa;
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 20px;
  display: flex;
  gap: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px 14px;
  }
`;

// Sidebar Navigation
const Sidebar = styled.div`
  width: 280px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #eef0f2;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  height: fit-content;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const UserHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
`;

const UserName = styled.h2`
  font-size: 20px;
  font-weight: 800;
  color: #1c1c1c;
  margin: 0;
`;

const UserEmail = styled.div`
  font-size: 13px;
  color: #696969;
  font-weight: 500;
`;

const NavList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  background: ${({ active }) => (active ? "#fff5f5" : "transparent")};
  color: ${({ active }) => (active ? "#e23744" : "#363636")};
  font-weight: ${({ active }) => (active ? "700" : "500")};
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #fff5f5;
    color: #e23744;
  }
`;

// Main Panel
const MainPanel = styled.div`
  flex: 1;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #eef0f2;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;

const PanelTitle = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: #1c1c1c;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ToggleEditBtn = styled.button`
  background: #ffffff;
  color: #e23744;
  border: 1.5px solid #e23744;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
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

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const InfoCard = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid #eef0f2;
`;

const InfoLabel = styled.label`
  font-size: 12px;
  color: #666;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const InfoValue = styled.div`
  font-size: 16px;
  color: #1c1c1c;
  font-weight: 700;
`;

const StyledInput = styled.input`
  width: 100%;
  height: 48px;
  padding: 12px 14px;
  border: 1.5px solid #dcdfe3;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #1c1c1c;
  outline: none;
  background: #ffffff;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:focus {
    border-color: #e23744;
    box-shadow: 0 0 0 3px rgba(226, 55, 68, 0.12);
  }
`;

const ActionBtn = styled.button`
  background: linear-gradient(135deg, #e23744, #c0392b);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 14px 28px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 14px rgba(226, 55, 68, 0.3);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(226, 55, 68, 0.4);
  }
`;

const Profile = ({ setOpenAuth }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [selectedCity, setSelectedCity] = useState("Allahabad / Prayagraj");
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Sync state with currentUser
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "9876543210",
        address: currentUser.address || "Civil Lines, Allahabad / Prayagraj",
      });
    }
  }, [currentUser]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  /* ── Save Profile Changes Functionality ── */
  const handleSaveProfile = async () => {
    if (!formData.name.trim()) {
      dispatch(openSnackbar({ message: "Full Name cannot be empty", severity: "error" }));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      dispatch(openSnackbar({ message: "Please enter a valid email address", severity: "error" }));
      return;
    }

    try {
      setSaving(true);
      const updatedUser = {
        ...currentUser,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      };

      // Update Redux state
      dispatch(loginSuccess(updatedUser));
      // Save locally
      localStorage.setItem("foodeli-user-data", JSON.stringify(updatedUser));

      setIsEditing(false);
      dispatch(openSnackbar({ message: "🎉 Profile updated successfully!", severity: "success" }));
    } catch (err) {
      dispatch(openSnackbar({ message: "Failed to update profile", severity: "error" }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container>
      <ZomatoHeader
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        setOpenAuth={setOpenAuth}
      />

      <Content>
        <Sidebar>
          <UserHeader>
            <Avatar
              src={currentUser?.img}
              sx={{ width: 80, height: 80, fontSize: 32, bgcolor: "#e23744" }}
            >
              {formData.name?.[0] || currentUser?.name?.[0] || "U"}
            </Avatar>
            <div>
              <UserName>{formData.name || currentUser?.name || "Guest User"}</UserName>
              <UserEmail>{formData.email || currentUser?.email || "guest@example.com"}</UserEmail>
            </div>
          </UserHeader>

          <NavList>
            <NavItem active={activeTab === "info"} onClick={() => setActiveTab("info")}>
              <Person style={{ fontSize: "20px" }} />
              Personal Info
            </NavItem>
            <NavItem onClick={() => navigate("/orders")}>
              <ShoppingBag style={{ fontSize: "20px" }} />
              My Orders
            </NavItem>
            <NavItem onClick={() => navigate("/favourites")}>
              <Favorite style={{ fontSize: "20px" }} />
              My Favourites
            </NavItem>
            <NavItem active={activeTab === "address"} onClick={() => setActiveTab("address")}>
              <LocationOn style={{ fontSize: "20px" }} />
              Saved Address
            </NavItem>
            <NavItem onClick={handleLogout} style={{ color: "#ef4444" }}>
              <ExitToApp style={{ fontSize: "20px" }} />
              Log Out
            </NavItem>
          </NavList>
        </Sidebar>

        <MainPanel>
          {activeTab === "info" && (
            <>
              <PanelHeader>
                <PanelTitle>
                  <Person style={{ color: "#e23744" }} />
                  Account Details
                </PanelTitle>

                <ToggleEditBtn onClick={() => setIsEditing(!isEditing)}>
                  <Edit style={{ fontSize: 16 }} />
                  {isEditing ? "Cancel Editing" : "Edit Profile"}
                </ToggleEditBtn>
              </PanelHeader>

              <InfoGrid>
                {/* Full Name Field */}
                <InfoCard>
                  <InfoLabel>
                    <Person style={{ fontSize: 16 }} /> Full Name *
                  </InfoLabel>
                  {isEditing ? (
                    <StyledInput
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData((fd) => ({ ...fd, name: e.target.value }))}
                      placeholder="Enter full name"
                    />
                  ) : (
                    <InfoValue>{formData.name || "User Name"}</InfoValue>
                  )}
                </InfoCard>

                {/* Email Address Field */}
                <InfoCard>
                  <InfoLabel>
                    <Email style={{ fontSize: 16 }} /> Email Address *
                  </InfoLabel>
                  {isEditing ? (
                    <StyledInput
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((fd) => ({ ...fd, email: e.target.value }))}
                      placeholder="Enter email address"
                    />
                  ) : (
                    <InfoValue>{formData.email || "user@example.com"}</InfoValue>
                  )}
                </InfoCard>

                {/* Phone Number Field */}
                <InfoCard>
                  <InfoLabel>
                    <Phone style={{ fontSize: 16 }} /> Phone Number
                  </InfoLabel>
                  {isEditing ? (
                    <StyledInput
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData((fd) => ({ ...fd, phone: e.target.value }))}
                      placeholder="Enter 10-digit phone"
                    />
                  ) : (
                    <InfoValue>{formData.phone || "9876543210"}</InfoValue>
                  )}
                </InfoCard>

                {/* Account Status */}
                <InfoCard>
                  <InfoLabel>Account Status</InfoLabel>
                  <InfoValue style={{ color: "#10b981", display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle style={{ fontSize: "18px" }} /> Verified Member
                  </InfoValue>
                </InfoCard>
              </InfoGrid>

              {isEditing ? (
                <ActionBtn onClick={handleSaveProfile} disabled={saving}>
                  {saving ? <CircularProgress size={18} style={{ color: "#fff" }} /> : <><Save style={{ fontSize: 18 }} /> Save Profile Changes</>}
                </ActionBtn>
              ) : (
                <ActionBtn onClick={() => navigate("/orders")}>View My Orders</ActionBtn>
              )}
            </>
          )}

          {activeTab === "address" && (
            <>
              <PanelHeader>
                <PanelTitle>
                  <LocationOn style={{ color: "#e23744" }} />
                  Delivery Address
                </PanelTitle>

                <ToggleEditBtn onClick={() => setIsEditing(!isEditing)}>
                  <Edit style={{ fontSize: 16 }} />
                  {isEditing ? "Cancel" : "Edit Address"}
                </ToggleEditBtn>
              </PanelHeader>

              <InfoCard style={{ background: "#ffffff", border: "1px solid #eef0f2" }}>
                <InfoLabel>Default Delivery Address</InfoLabel>
                {isEditing ? (
                  <StyledInput
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData((fd) => ({ ...fd, address: e.target.value }))}
                    placeholder="House/Flat, Street, Area, City"
                  />
                ) : (
                  <InfoValue style={{ fontSize: "15px", fontWeight: "500", marginTop: "6px" }}>
                    {formData.address || "Civil Lines, Allahabad / Prayagraj, Uttar Pradesh - 211001"}
                  </InfoValue>
                )}
              </InfoCard>

              {isEditing ? (
                <ActionBtn onClick={handleSaveProfile} disabled={saving}>
                  {saving ? <CircularProgress size={18} style={{ color: "#fff" }} /> : <><Save style={{ fontSize: 18 }} /> Save Address</>}
                </ActionBtn>
              ) : (
                <ActionBtn onClick={() => setIsEditing(true)}>Edit Saved Address</ActionBtn>
              )}
            </>
          )}
        </MainPanel>
      </Content>

      <Footer />
    </Container>
  );
};

export default Profile;
