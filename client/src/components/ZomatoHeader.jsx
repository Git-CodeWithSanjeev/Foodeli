import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import {
  LocationOn,
  Search,
  ArrowDropDown,
  ShoppingCartOutlined,
  FavoriteBorder,
  ShoppingBagOutlined,
  Close,
  MyLocation
} from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/reducers/UserSlice";
import { getAllProducts, getCart } from "../api";
import BrandLogo from "./BrandLogo";

const HeaderContainer = styled.header`
  width: 100%;
  background: #ffffff;
  border-bottom: 1px solid #e8e8e8;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const HeaderInner = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 12px 14px;
    flex-wrap: wrap;
  }
`;

const SearchLocationGroup = styled.div`
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  flex: 1;
  max-width: 680px;
  height: 48px;
  position: relative;

  @media (max-width: 768px) {
    order: 3;
    width: 100%;
    max-width: 100%;
    margin-top: 6px;
  }
`;

const LocationSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px;
  color: #1c1c1c;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-right: 1px solid #e8e8e8;
  white-space: nowrap;
  position: relative;
  user-select: none;
`;

const CityDropdown = styled.div`
  position: absolute;
  top: 54px;
  left: 0;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: 1px solid #e8e8e8;
  width: 280px;
  max-height: 380px;
  overflow-y: auto;
  padding: 8px 0;
  z-index: 1100;
  display: ${({ show }) => (show ? "block" : "none")};
`;

const CitySearchInput = styled.input`
  width: calc(100% - 24px);
  margin: 4px 12px 8px 12px;
  padding: 8px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
  &:focus {
    border-color: #e23744;
  }
`;

const DropdownItem = styled.div`
  padding: 10px 16px;
  font-size: 14px;
  color: #363636;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  &:hover {
    background: #f8f8f8;
    color: #e23744;
  }
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 14px;
  flex: 1;
  gap: 8px;

  input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 14px;
    color: #1c1c1c;

    &::placeholder {
      color: #9c9c9c;
    }
  }
`;

const SearchSuggestions = styled.div`
  position: absolute;
  top: 54px;
  left: 0;
  right: 0;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: 1px solid #e8e8e8;
  max-height: 320px;
  overflow-y: auto;
  z-index: 1100;
`;

const SuggestionItem = styled.div`
  padding: 12px 16px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid #f4f4f4;

  &:hover {
    background: #f8f8f8;
  }
`;

const UserNavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
`;

const NavItemLink = styled(Link)`
  color: #363636;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s ease;

  &:hover {
    color: #e23744;
  }
`;

const SignBtn = styled.button`
  background: transparent;
  color: #1c1c1c;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    color: #e23744;
  }
`;

const INDIAN_CITIES = [
  "Allahabad / Prayagraj",
  "Delhi / NCR",
  "Mumbai",
  "Bangalore / Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Jaipur",
  "Lucknow",
  "Varanasi",
  "Agra",
  "Kanpur",
  "Noida",
  "Gurgaon",
  "Ahmedabad",
  "Surat",
  "Chandigarh",
  "Amritsar",
  "Indore",
  "Bhopal",
  "Goa",
  "Kochi",
  "Coimbatore",
  "Patna",
  "Bhubaneswar",
  "Dehradun"
];

const ZomatoHeader = ({ selectedCity, setSelectedCity, setOpenAuth }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      const token = localStorage.getItem("foodeli-app-token") || localStorage.getItem("krist-app-token");
      if (!token) return;
      try {
        const res = await getCart();
        const valid = (res.data || []).filter((item) => item && item.product);
        setCartCount(valid.length);
      } catch (_) {}
    };
    fetchCartCount();
  }, []);

  const filteredCities = INDIAN_CITIES.filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 0) {
      try {
        const res = await getAllProducts(`search=${encodeURIComponent(val)}`);
        setSuggestions(res.data || []);
      } catch (err) {
        console.error("Search suggestion error:", err);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (dishId) => {
    setSearchQuery("");
    setSuggestions([]);
    navigate(`/dishes/${dishId}`);
  };

  const handleDetectGPS = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setSelectedCity(`GPS (${pos.coords.latitude.toFixed(2)}°, ${pos.coords.longitude.toFixed(2)}°)`);
          setShowDropdown(false);
        },
        () => {
          setSelectedCity("Allahabad / Prayagraj");
          setShowDropdown(false);
        }
      );
    }
  };

  return (
    <HeaderContainer>
      <HeaderInner>
        <BrandLogo />

        <SearchLocationGroup>
          <LocationSelector onClick={() => setShowDropdown(!showDropdown)}>
            <LocationOn style={{ color: "#e23744", fontSize: "20px" }} />
            <span style={{ maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis" }}>
              {selectedCity}
            </span>
            <ArrowDropDown style={{ color: "#1c1c1c" }} />

            <CityDropdown show={showDropdown} onClick={(e) => e.stopPropagation()}>
              <CitySearchInput
                type="text"
                placeholder="Search city in India..."
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
              />
              <DropdownItem onClick={handleDetectGPS}>
                <MyLocation style={{ color: "#e23744", fontSize: "18px" }} />
                <strong>Detect Current Location</strong>
              </DropdownItem>
              {filteredCities.map((c) => (
                <DropdownItem
                  key={c}
                  onClick={() => {
                    setSelectedCity(c);
                    setShowDropdown(false);
                    setCitySearch("");
                  }}
                >
                  <LocationOn style={{ color: "#9c9c9c", fontSize: "16px" }} />
                  {c}
                </DropdownItem>
              ))}
              {filteredCities.length === 0 && citySearch.trim() && (
                <DropdownItem
                  onClick={() => {
                    setSelectedCity(citySearch.trim());
                    setShowDropdown(false);
                    setCitySearch("");
                  }}
                >
                  <LocationOn style={{ color: "#e23744", fontSize: "16px" }} />
                  Search for "{citySearch.trim()}"
                </DropdownItem>
              )}
            </CityDropdown>
          </LocationSelector>

          <SearchInputWrapper>
            <Search style={{ color: "#9c9c9c", fontSize: "20px" }} />
            <input
              type="text"
              placeholder="Search for restaurant, cuisine or a dish..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <Close
                style={{ color: "#9c9c9c", fontSize: "18px", cursor: "pointer" }}
                onClick={() => {
                  setSearchQuery("");
                  setSuggestions([]);
                }}
              />
            )}
          </SearchInputWrapper>

          {suggestions.length > 0 && (
            <SearchSuggestions>
              {suggestions.map((item) => (
                <SuggestionItem key={item._id} onClick={() => handleSuggestionClick(item._id)}>
                  <div>
                    <div style={{ fontWeight: "600", color: "#1c1c1c" }}>{item.name}</div>
                    <div style={{ fontSize: "12px", color: "#696969" }}>{item.category?.[0]}</div>
                  </div>
                  <div style={{ fontWeight: "700", color: "#e23744" }}>
                    ₹{item.price?.org || 199}
                  </div>
                </SuggestionItem>
              ))}
            </SearchSuggestions>
          )}
        </SearchLocationGroup>

        <UserNavGroup>
          <NavItemLink to="/favourites">
            <FavoriteBorder style={{ fontSize: "22px" }} />
          </NavItemLink>
          <NavItemLink to="/cart" style={{ position: "relative" }}>
            <ShoppingCartOutlined style={{ fontSize: "22px" }} />
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -8,
                  background: "#e23744",
                  color: "#ffffff",
                  fontSize: "10px",
                  fontWeight: 800,
                  borderRadius: "50%",
                  width: 18,
                  height: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {cartCount}
              </span>
            )}
          </NavItemLink>
          <NavItemLink to="/orders">
            <ShoppingBagOutlined style={{ fontSize: "22px" }} />
          </NavItemLink>

          {currentUser ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Avatar
                src={currentUser?.img}
                onClick={() => navigate("/profile")}
                style={{ cursor: "pointer", border: "2px solid #e23744" }}
              >
                {currentUser?.name?.[0]}
              </Avatar>
              <NavItemLink to="/profile">Profile</NavItemLink>
              <SignBtn onClick={() => dispatch(logout())}>Log out</SignBtn>
            </div>
          ) : (
            <SignBtn onClick={() => setOpenAuth(true)}>Log in</SignBtn>
          )}
        </UserNavGroup>
      </HeaderInner>
    </HeaderContainer>
  );
};

export default ZomatoHeader;
