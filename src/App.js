import React, { useEffect, useState, useCallback } from "react";
// import axios from "axios";
import "./App.css";
import SeasonBackground from "./SeasonBackground";
import SeasonEffects from "./SeasonEffects";
import CursorEffect from "./CursorEffect";

// const API_BASE = "https://explorely-backend.onrender.com/api";
function App() {
  // Data states
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [spots, setSpots] = useState([]);

  // Selection states
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [stateSearch, setStateSearch] = useState("");

  // // UI states
  // const [loadingCities, setLoadingCities] = useState(false);
  // const [loadingSpots, setLoadingSpots] = useState(false);
  // const [error, setError] = useState("");

  // Theme states
  const [season, setSeason] = useState("winter");
  const [darkMode, setDarkMode] = useState(true);

  // Wishlist state (persisted in localStorage)
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("explorely-wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showWishlist, setShowWishlist] = useState(false);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("explorely-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  /* ===========================
     WISHLIST HELPERS
  =========================== */
  const isInWishlist = useCallback(
    (spotName, city) =>
      wishlist.some((w) => w.name === spotName && w.city === city),
    [wishlist]
  );

  const toggleWishlist = useCallback(
    (spot) => {
      setWishlist((prev) => {
        const exists = prev.some(
          (w) => w.name === spot.name && w.city === spot.city
        );
        if (exists) {
          return prev.filter(
            (w) => !(w.name === spot.name && w.city === spot.city)
          );
        } else {
          return [...prev, { ...spot }];
        }
      });
    },
    []
  );

  const removeFromWishlist = useCallback((spot) => {
    setWishlist((prev) =>
      prev.filter((w) => !(w.name === spot.name && w.city === spot.city))
    );
  }, []);

  /* ===========================
     FETCH STATES ON MOUNT
  =========================== */
  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/data/states.json")
      .then(res => res.json())
      .then(data => setStates(data))
      .catch(err => console.error("Error loading states:", err));
  }, []);

  /* ===========================
     FETCH CITIES WHEN STATE CHANGES
  =========================== */
  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      setSelectedCity("");
      return;
    }

    fetch(process.env.PUBLIC_URL + "/data/cities.json")
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(
          city => city.state === selectedState
        );
        setCities(filtered);
      })
      .catch(err => console.error("Error loading cities:", err));
  }, [selectedState]);
  /* ===========================
     FETCH SPOTS WHEN CITY CHANGES
  =========================== */
  useEffect(() => {
    if (!selectedCity) return;

    fetch(process.env.PUBLIC_URL + "/data/spots.json")
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(
          spot => spot.city === selectedCity
        );
        setSpots(filtered);
      })
      .catch(err => console.error("Error loading spots:", err));
  }, [selectedCity]);

  /* ===========================
     HANDLE STATE SELECTION
  =========================== */
  const handleStateSelect = useCallback((stateName) => {
    setSelectedState(stateName);
    setStateSearch(stateName);

    // Reset dependent data
    setSelectedCity("");
    setCities([]);
    setSpots([]);
  }, []);

  /* ===========================
     FILTER STATES BY SEARCH
  =========================== */
  const filteredStates = states.filter((state) =>
    state.name.toLowerCase().includes(stateSearch.toLowerCase())
  );

  // Show dropdown only when searching and input doesn't exactly match
  const showStateDropdown =
    stateSearch.length > 0 &&
    stateSearch !== selectedState &&
    filteredStates.length > 0;

  return (
    <div className={`app ${darkMode ? "dark" : "light"} season-${season}`}>
      {/* Season & Cursor Effects */}
      <SeasonEffects season={season} />
      <CursorEffect season={season} />
      <SeasonBackground season={season} />

      {/* ===========================
          HEADER BAR
      =========================== */}
      <header className="header-bar">
        {/* Left: Logo + Brand Name */}
        <div className="header-left" id="header-brand">
          <img
            src="/explorely-logo.png"
            alt="Explorely Logo"
            className="header-logo"
          />
          <span className="header-brand-name">Explorely</span>
        </div>

        {/* Right: Wishlist + Season Toggles + Dark/Light */}
        <div className="header-right">
          {/* Wishlist Toggle */}
          <button
            className={`wishlist-toggle-btn ${showWishlist ? "active" : ""}`}
            onClick={() => setShowWishlist((v) => !v)}
            title="My Wishlist"
            id="wishlist-toggle"
          >
            ❤️
            {wishlist.length > 0 && (
              <span className="wishlist-badge">{wishlist.length}</span>
            )}
          </button>

          <div className="header-divider-v" />

          {/* Season Toggle Buttons */}
          <div className="season-toggles">
            <button
              className={`season-btn ${season === "winter" ? "active" : ""}`}
              onClick={() => setSeason("winter")}
              title="Winter Theme"
              id="winter-btn"
            >
              ❄️
            </button>
            <button
              className={`season-btn ${season === "summer" ? "active" : ""}`}
              onClick={() => setSeason("summer")}
              title="Summer Theme"
              id="summer-btn"
            >
              🌞
            </button>
            <button
              className={`season-btn ${season === "rain" ? "active" : ""}`}
              onClick={() => setSeason("rain")}
              title="Rain Theme"
              id="rain-btn"
            >
              💧
            </button>
          </div>

          <div className="header-divider-v" />

          {/* Dark/Light Mode Toggle */}
          <div className="mode-toggle" id="mode-toggle">
            <label className="switch">
              <input
                type="checkbox"
                checked={!darkMode}
                onChange={() => setDarkMode((d) => !d)}
                id="theme-switch"
              />
              <span className="slider">
                <span className="slider-icon">{darkMode ? "🌙" : "☀️"}</span>
              </span>
            </label>
          </div>
        </div>
      </header>

      {/* ===========================
          WISHLIST PANEL (Slide-in)
      =========================== */}
      {showWishlist && (
        <div className="wishlist-overlay" onClick={() => setShowWishlist(false)}>
          <div
            className="wishlist-panel fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="wishlist-header">
              <h2>❤️ My Wishlist</h2>
              <button
                className="wishlist-close"
                onClick={() => setShowWishlist(false)}
              >
                ✕
              </button>
            </div>
            {wishlist.length === 0 ? (
              <div className="wishlist-empty">
                <span className="empty-icon">📋</span>
                <p>Your wishlist is empty.</p>
                <p className="hint-text">
                  Tap the heart on any tourist spot to add it!
                </p>
              </div>
            ) : (
              <div className="wishlist-items">
                {wishlist.map((item, idx) => (
                  <div className="wishlist-item" key={idx}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="wishlist-item-img"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200";
                      }}
                    />
                    <div className="wishlist-item-info">
                      <h4>{item.name}</h4>
                      <p>{item.city}</p>
                      <a
                        href={item.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="wishlist-map-link"
                      >
                        📍 Maps
                      </a>
                    </div>
                    <button
                      className="wishlist-remove"
                      onClick={() => removeFromWishlist(item)}
                      title="Remove"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===========================
          MAIN CONTENT
      =========================== */}
      <main className="main-content">
        {/* Branding Section */}
        <section className="branding" id="branding">
          <h1 className="brand-title">Explorely</h1>
          <p className="tagline">
            Discover tourist places across India — state by state, city by city.
          </p>
          <p className="season-label">
            🌍 Experience destinations in different seasons
          </p>
        </section>

        <hr className="section-divider" />

        {/* Error Display */}
        {error && (
          <div className="error-box" id="error-box">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Selection Section */}
        <section className="selection-section">
          {/* State Search & Selection */}
          <div className="select-box" id="state-select-box">
            <label className="select-label">
              <span className="label-title">🗺️ Select State</span>
              <span className="label-subtitle">
                Start your journey by choosing a state
              </span>
            </label>
            <div className="search-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="🔍 Type to search states..."
                value={stateSearch}
                onChange={(e) => {
                  setStateSearch(e.target.value);
                  if (e.target.value === "") {
                    setSelectedState("");
                  }
                }}
                id="state-search-input"
              />
              {/* Searchable Dropdown */}
              {showStateDropdown && (
                <ul className="dropdown-list" id="state-dropdown">
                  {filteredStates.map((state) => (
                    <li
                      key={state.code}
                      className="dropdown-item"
                      onClick={() => handleStateSelect(state.name)}
                    >
                      <span className="state-code">{state.code}</span>
                      {state.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {!selectedState && !stateSearch && (
              <p className="hint-text">
                🌍 Select a state to explore popular cities and tourist
                destinations.
              </p>
            )}
          </div>

          {/* City Selection */}
          {selectedState && (
            <div className="select-box fade-in" id="city-select-box">
              <label className="select-label">
                <span className="label-title">🏙️ Select City</span>
                <span className="label-subtitle">
                  Cities available in {selectedState}
                </span>
              </label>
              {loadingCities ? (
                <div className="loading-box">
                  <div className="spinner" />
                  <span>Loading cities...</span>
                </div>
              ) : (
                <select
                  className="city-select"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  id="city-dropdown"
                >
                  <option value="">-- Choose City --</option>
                  {cities.map((city, idx) => (
                    <option key={idx} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </section>

        {/* Loading Spots */}
        {loadingSpots && (
          <div className="loading-box spots-loading">
            <div className="spinner" />
            <span>Discovering tourist spots...</span>
          </div>
        )}

        {/* Tourist Spots Grid */}
        {spots.length > 0 && (
          <section className="spots-section fade-in" id="spots-section">
            <h2 className="spots-title">
              ✨ Tourist Places in {selectedCity}
            </h2>
            <div className="spots-grid">
              {spots.map((spot, index) => (
                <article
                  className="spot-card"
                  key={index}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  id={`spot-card-${index}`}
                >
                  <div className="spot-image-wrapper">
                    <img
                      src={spot.image}
                      alt={spot.name}
                      className="spot-image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600";
                      }}
                    />
                    <div className="spot-image-overlay" />
                    {/* Wishlist Heart Button */}
                    <button
                      className={`wishlist-heart ${isInWishlist(spot.name, spot.city) ? "active" : ""
                        }`}
                      onClick={() => toggleWishlist(spot)}
                      title={
                        isInWishlist(spot.name, spot.city)
                          ? "Remove from Wishlist"
                          : "Add to Wishlist"
                      }
                    >
                      {isInWishlist(spot.name, spot.city) ? "❤️" : "🤍"}
                    </button>
                  </div>
                  <div className="spot-content">
                    <h3 className="spot-name">{spot.name}</h3>
                    <p className="spot-description">{spot.description}</p>
                    <a
                      href={spot.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="map-link"
                    >
                      📍 View on Google Maps
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Empty state when city selected but no spots */}
        {selectedCity && !loadingSpots && spots.length === 0 && (
          <div className="empty-state fade-in">
            <span className="empty-icon">🏖️</span>
            <p>No tourist spots found for {selectedCity}.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer" id="footer">
        <p>© 2026 Explorely · Made for travelers 🇮🇳</p>
      </footer>
    </div>
  );
}

export default App;
