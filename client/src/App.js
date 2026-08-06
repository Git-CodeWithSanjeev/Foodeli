import styled, { ThemeProvider } from "styled-components";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { lightTheme } from "./utils/Themes";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ZomatoDelivery from "./pages/ZomatoDelivery";
import { useState } from "react";
import Authentication from "./pages/Authentication";
import Favourites from "./pages/Favourites";
import Cart from "./pages/Cart";
import FoodDetails from "./pages/FoodDetails";
import FoodListing from "./pages/FoodListing";
import Restaurants from "./pages/Restaurants";
import Orders from "./pages/Orders";
import { useSelector, useDispatch } from "react-redux";
import Footer from "./components/Footer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Search from "./pages/Search";
import { Snackbar, Alert } from "@mui/material";
import { closeSnackbar } from "./redux/reducers/SnackbarSlice";

import RestaurantDetails from "./pages/RestaurantDetails";
import Profile from "./pages/Profile";

const Container = styled.div``;

function AppContent({ setOpenAuth, openAuth }) {
  const location = useLocation();
  const isZomatoCustomHeaderPage =
    location.pathname === "/" ||
    location.pathname === "/delivery" ||
    location.pathname === "/profile" ||
    location.pathname.startsWith("/restaurants/");
  const { currentUser } = useSelector((state) => state.user);

  return (
    <>
      {!isZomatoCustomHeaderPage && (
        <Navbar
          setOpenAuth={setOpenAuth}
          openAuth={openAuth}
          currentUser={currentUser}
        />
      )}
      <Routes>
        <Route path="/" exact element={<ZomatoDelivery setOpenAuth={setOpenAuth} />} />
        <Route path="/delivery" exact element={<ZomatoDelivery setOpenAuth={setOpenAuth} />} />
        <Route path="/classic-home" exact element={<Home />} />
        <Route path="/favourites" exact element={<Favourites />} />
        <Route path="/cart" exact element={<Cart />} />
        <Route path="/dishes/:id" exact element={<FoodDetails />} />
        <Route path="/dishes" exact element={<FoodListing />} />
        <Route path="/restaurants" exact element={<Restaurants />} />
        <Route path="/restaurants/:id" exact element={<RestaurantDetails setOpenAuth={setOpenAuth} />} />
        <Route path="/profile" exact element={<Profile setOpenAuth={setOpenAuth} />} />
        <Route path="/orders" exact element={<Orders />} />
        <Route path="/about" exact element={<About />} />
        <Route path="/contact" exact element={<Contact />} />
        <Route path="/privacy" exact element={<PrivacyPolicy />} />
        <Route path="/search" exact element={<Search />} />
      </Routes>
      {!isZomatoCustomHeaderPage && <Footer />}
    </>
  );
}

function App() {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state) => state.snackbar);
  const [openAuth, setOpenAuth] = useState(false);

  const handleCloseSnackbar = () => {
    dispatch(closeSnackbar());
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <BrowserRouter>
        <Container>
          <AppContent setOpenAuth={setOpenAuth} openAuth={openAuth} />
          {openAuth && (
            <Authentication setOpenAuth={setOpenAuth} openAuth={openAuth} />
          )}
          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={severity}
              sx={{ width: "100%" }}
            >
              {message}
            </Alert>
          </Snackbar>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
