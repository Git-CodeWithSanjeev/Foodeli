import React, { useState } from "react";
import styled from "styled-components";
import { Link as LinkR, NavLink, useNavigate } from "react-router-dom";
import LogoImg from "../utils/Images/Logo.png";
import {
  FavoriteBorder,
  MenuRounded,
  SearchRounded,
  ShoppingCartOutlined,
  Close,
} from "@mui/icons-material";
import Button from "./Button";
import { Avatar } from "@mui/material";
import { useDispatch } from "react-redux";
import { logout } from "../redux/reducers/UserSlice";
import { getAllProducts } from "../api";

const SearchContainer = styled.div`
  position: absolute;
  top: 80px;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.bg};
  padding: 20px;
  display: ${({ $show }) => ($show ? "flex" : "none")};
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  z-index: 1000;
`;

const SearchInput = styled.input`
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.text_secondary || "#d1d5db"};
  font-size: 16px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.primary || "#eb0029"};
  }
`;

const SearchResults = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
`;

const SearchResult = styled.div`
  padding: 12px;
  border-radius: 8px;
  background: ${({ theme }) => theme.card_light || "#f9fafb"};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s ease;

  &:hover {
    background: #f3f4f6;
  }
`;

const CloseButton = styled.div`
  position: absolute;
  right: 24px;
  top: 20px;
  cursor: pointer;
  color: ${({ theme }) => theme.text_primary};
`;

const Nav = styled.div`
  background-color: ${({ theme }) => theme.bg};
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const NavContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 24px;
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  position: relative;
`;

const NavLogo = styled(LinkR)`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 6px;
  font-weight: 500;
  font-size: 18px;
  text-decoration: none;
  color: inherit;
`;

const Logo = styled.img`
  height: 34px;
`;

const NavItems = styled.ul`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 0 6px;
  list-style: none;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Navlink = styled(NavLink)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
  &.active {
    color: ${({ theme }) => theme.primary};
    border-bottom: 1.8px solid ${({ theme }) => theme.primary};
  }
`;

const ButtonContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 28px;
  align-items: center;
  padding: 0 6px;
  color: ${({ theme }) => theme.primary};
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const MobileIcon = styled.div`
  color: ${({ theme }) => theme.text_primary};
  display: none;
  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const MobileIcons = styled.div`
  color: ${({ theme }) => theme.text_primary};
  display: none;
  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }
`;

const MobileMenu = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 16px;
  list-style: none;
  width: 80%;
  padding: 12px 40px 24px 40px;
  background: ${({ theme }) => theme.card || "#ffffff"};
  position: absolute;
  top: 80px;
  right: 0;
  transition: all 0.4s ease-in-out;
  transform: ${({ $isOpen }) => ($isOpen ? "translateY(0)" : "translateY(-100%)")};
  border-radius: 0 0 20px 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  opacity: ${({ $isOpen }) => ($isOpen ? "100%" : "0")};
  z-index: ${({ $isOpen }) => ($isOpen ? "1000" : "-1000")};
`;

const TextButton = styled.span`
  text-align: end;
  color: ${({ theme }) => theme.secondary || "#4b5563"};
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  font-weight: 600;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Navbar = ({ setOpenAuth, openAuth, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      try {
        const res = await getAllProducts(`search=${encodeURIComponent(query)}`);
        setSearchResults(res.data || []);
      } catch (err) {
        console.error("Search error:", err);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleResultClick = (id) => {
    setShowSearch(false);
    setSearchQuery("");
    setSearchResults([]);
    navigate(`/dishes/${id}`);
  };

  return (
    <Nav>
      <NavContainer>
        <MobileIcon onClick={() => setIsOpen(!isOpen)}>
          <MenuRounded style={{ color: "inherit" }} />
        </MobileIcon>
        <NavLogo to="/">
          <Logo src={LogoImg} alt="Foodeli" />
        </NavLogo>

        <MobileIcons>
          <div onClick={() => setShowSearch(!showSearch)}>
            <SearchRounded sx={{ color: "inherit", fontSize: "30px", cursor: "pointer" }} />
          </div>
          <Navlink to="/favourites">
            <FavoriteBorder sx={{ color: "inherit", fontSize: "28px" }} />
          </Navlink>
          <Navlink to="/cart">
            <ShoppingCartOutlined sx={{ color: "inherit", fontSize: "28px" }} />
          </Navlink>
          {currentUser && (
            <Avatar src={currentUser?.img}>{currentUser?.name?.[0]}</Avatar>
          )}
        </MobileIcons>

        <NavItems>
          <Navlink to="/">Home</Navlink>
          <Navlink to="/dishes">Dishes</Navlink>
          <Navlink to="/restaurants">Restaurants</Navlink>
          <Navlink to="/orders">Orders</Navlink>
          <Navlink to="/contact">Contact</Navlink>
        </NavItems>

        <ButtonContainer>
          <IconContainer>
            <div onClick={() => setShowSearch(!showSearch)}>
              <SearchRounded sx={{ color: "inherit", fontSize: "30px", cursor: "pointer" }} />
            </div>
            <Navlink to="/favourites">
              <FavoriteBorder sx={{ color: "inherit", fontSize: "28px" }} />
            </Navlink>
            <Navlink to="/cart">
              <ShoppingCartOutlined sx={{ color: "inherit", fontSize: "28px" }} />
            </Navlink>
          </IconContainer>
          {currentUser ? (
            <>
              <Avatar
                src={currentUser?.img}
                onClick={() => navigate("/profile")}
                style={{ cursor: "pointer" }}
              >
                {currentUser?.name?.[0]}
              </Avatar>
              <TextButton onClick={() => dispatch(logout())}>Logout</TextButton>
            </>
          ) : (
            <>
              <Button text="Sign In" $small onClick={() => setOpenAuth(true)} />
            </>
          )}
        </ButtonContainer>
      </NavContainer>

      <SearchContainer $show={showSearch}>
        <CloseButton onClick={() => setShowSearch(false)}>
          <Close />
        </CloseButton>
        <SearchInput
          placeholder="Search for dishes, restaurants, etc."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {searchResults.length > 0 && (
          <SearchResults>
            {searchResults.map((result) => (
              <SearchResult key={result._id} onClick={() => handleResultClick(result._id)}>
                <div style={{ fontWeight: "600" }}>{result.name}</div>
                <div style={{ color: "#eb0029", fontWeight: "700" }}>
                  ₹{result.price?.org || result.price?.mrp || 199}
                </div>
              </SearchResult>
            ))}
          </SearchResults>
        )}
      </SearchContainer>

      {isOpen && (
        <MobileMenu $isOpen={isOpen}>
          <Navlink to="/" onClick={() => setIsOpen(false)}>
            Home
          </Navlink>
          <Navlink to="/dishes" onClick={() => setIsOpen(false)}>
            Dishes
          </Navlink>
          <Navlink to="/restaurants" onClick={() => setIsOpen(false)}>
            Restaurants
          </Navlink>
          <Navlink to="/orders" onClick={() => setIsOpen(false)}>
            Orders
          </Navlink>
          <Navlink to="/contact" onClick={() => setIsOpen(false)}>
            Contact
          </Navlink>
          {currentUser ? (
            <TextButton onClick={() => dispatch(logout())}>Logout</TextButton>
          ) : (
            <div style={{ display: "flex", gap: "12px" }}>
              <Button
                text="Sign Up"
                $outlined
                $small
                onClick={() => setOpenAuth(true)}
              />
              <Button text="Sign In" $small onClick={() => setOpenAuth(true)} />
            </div>
          )}
        </MobileMenu>
      )}
    </Nav>
  );
};

export default Navbar;
