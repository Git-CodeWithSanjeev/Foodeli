import React, { useState } from "react";
import styled from "styled-components";
import {
  DeliveryDining,
  Restaurant,
  LocalBar,
  Tune,
  Star,
  Speed,
  LocalOffer,
  SwapVert,
  Check
} from "@mui/icons-material";

const Container = styled.div`
  width: 100%;
  background: #ffffff;
  border-bottom: 1px solid #e8e8e8;
`;

const InnerWrapper = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
`;

const ModeTabs = styled.div`
  display: flex;
  gap: 40px;
  border-bottom: 1px solid #f0f0f0;

  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const TabItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 0;
  cursor: pointer;
  border-bottom: 3px solid ${({ active }) => (active ? "#e23744" : "transparent")};
  color: ${({ active }) => (active ? "#e23744" : "#696969")};
  font-weight: ${({ active }) => (active ? "700" : "500")};
  font-size: 16px;
  transition: all 0.2s ease;

  &:hover {
    color: #e23744;
  }
`;

const TabIconCircle = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${({ active }) => (active ? "#fceecb" : "#f8f8f8")};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ active }) => (active ? "#e23744" : "#696969")};
`;

const FilterPillsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
  overflow-x: auto;
  white-space: nowrap;
  position: relative;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterPill = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid ${({ active }) => (active ? "#e23744" : "#cfcfcf")};
  background: ${({ active }) => (active ? "#fef2f2" : "#ffffff")};
  color: ${({ active }) => (active ? "#e23744" : "#9c9c9c")};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #e23744;
    color: #e23744;
  }
`;

const SortDropdown = styled.div`
  position: absolute;
  top: 54px;
  right: 24px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: 1px solid #e8e8e8;
  width: 220px;
  padding: 8px 0;
  z-index: 1000;
  display: ${({ show }) => (show ? "block" : "none")};
`;

const SortOption = styled.div`
  padding: 10px 16px;
  font-size: 14px;
  color: #363636;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  &:hover {
    background: #f8f8f8;
    color: #e23744;
  }
`;

const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Rating: High to Low", value: "rating_desc" },
  { label: "Delivery Time", value: "delivery_time" },
  { label: "Cost: Low to High", value: "cost_asc" },
  { label: "Cost: High to Low", value: "cost_desc" },
];

const ZomatoFilterBar = ({
  activeTab,
  setActiveTab,
  filters,
  setFilters,
  sortBy,
  setSortBy
}) => {
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const toggleFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Container>
      <InnerWrapper>
        <ModeTabs>
          <TabItem active={activeTab === "delivery"} onClick={() => setActiveTab("delivery")}>
            <TabIconCircle active={activeTab === "delivery"}>
              <DeliveryDining style={{ fontSize: "24px" }} />
            </TabIconCircle>
            Delivery
          </TabItem>

          <TabItem active={activeTab === "dining"} onClick={() => setActiveTab("dining")}>
            <TabIconCircle active={activeTab === "dining"}>
              <Restaurant style={{ fontSize: "24px" }} />
            </TabIconCircle>
            Dining Out
          </TabItem>

          <TabItem active={activeTab === "nightlife"} onClick={() => setActiveTab("nightlife")}>
            <TabIconCircle active={activeTab === "nightlife"}>
              <LocalBar style={{ fontSize: "24px" }} />
            </TabIconCircle>
            Nightlife
          </TabItem>
        </ModeTabs>

        <FilterPillsRow>
          <FilterPill
            active={Object.values(filters).some(Boolean)}
            onClick={() => setFilters({ minRating: false, isPureVeg: false, fastDelivery: false, hasOffers: false })}
          >
            <Tune style={{ fontSize: "16px" }} />
            Filters
          </FilterPill>

          <FilterPill
            active={filters.minRating}
            onClick={() => toggleFilter("minRating")}
          >
            <Star style={{ fontSize: "16px", color: filters.minRating ? "#e23744" : "#eab308" }} />
            Rating: 4.0+
          </FilterPill>

          <FilterPill
            active={filters.isPureVeg}
            onClick={() => toggleFilter("isPureVeg")}
          >
            <span style={{ color: "#10b981", fontWeight: "700" }}>🟢</span>
            Pure Veg
          </FilterPill>

          <FilterPill
            active={filters.fastDelivery}
            onClick={() => toggleFilter("fastDelivery")}
          >
            <Speed style={{ fontSize: "16px" }} />
            Fast Delivery (&lt;30 min)
          </FilterPill>

          <FilterPill
            active={filters.hasOffers}
            onClick={() => toggleFilter("hasOffers")}
          >
            <LocalOffer style={{ fontSize: "16px" }} />
            Great Offers
          </FilterPill>

          <FilterPill onClick={() => setShowSortDropdown(!showSortDropdown)}>
            <SwapVert style={{ fontSize: "16px" }} />
            Sort By
          </FilterPill>

          <SortDropdown show={showSortDropdown}>
            {SORT_OPTIONS.map((opt) => (
              <SortOption
                key={opt.value}
                onClick={() => {
                  setSortBy(opt.value);
                  setShowSortDropdown(false);
                }}
              >
                <span>{opt.label}</span>
                {sortBy === opt.value && <Check style={{ fontSize: "16px", color: "#e23744" }} />}
              </SortOption>
            ))}
          </SortDropdown>
        </FilterPillsRow>
      </InnerWrapper>
    </Container>
  );
};

export default ZomatoFilterBar;
