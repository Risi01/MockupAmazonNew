import { useEffect, useMemo, useState, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./App.css";

const fallbackProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 99.99,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    description:
      "Comfortable wireless headphones with clear sound and noise-reducing ear cushions."
  },
  {
    id: 2,
    name: "Running Shoes",
    category: "Fashion",
    price: 59.99,
    rating: 4.2,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    description:
      "Lightweight running shoes designed for everyday training, walking, and comfort."
  },
  {
    id: 3,
    name: "Coffee Maker",
    category: "Home",
    price: 79.99,
    rating: 4.0,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80",
    description:
      "Easy-to-use coffee maker for quick brewing at home, in dorms, or in small offices."
  },
  {
    id: 4,
    name: "Smartphone",
    category: "Electronics",
    price: 699.99,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
    description:
      "Modern smartphone with a large display, fast performance, and a clean design."
  },
  {
    id: 5,
    name: "Jacket",
    category: "Fashion",
    price: 89.99,
    rating: 4.3,
    image:
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=600&q=80",
    description:
      "Stylish everyday jacket that works well for casual outfits and cooler weather."
  },
  {
    id: 6,
    name: "Blender",
    category: "Home",
    price: 49.99,
    rating: 4.1,
    image:
      "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=600&q=80",
    description:
      "Compact blender for smoothies, shakes, and simple kitchen preparation."
  }
];

const fallbackAnalytics = [
  { id: 6, product: "Blender", category: "Home", totalSold: 8, revenue: 399.92 },
  { id: 2, product: "Running Shoes", category: "Fashion", totalSold: 7, revenue: 419.93 },
  { id: 1, product: "Wireless Headphones", category: "Electronics", totalSold: 6, revenue: 599.94 },
  { id: 3, product: "Coffee Maker", category: "Home", totalSold: 5, revenue: 399.95 },
  { id: 4, product: "Smartphone", category: "Electronics", totalSold: 3, revenue: 2099.97 },
  { id: 5, product: "Jacket", category: "Fashion", totalSold: 3, revenue: 269.97 }
];

const fallbackSummary = {
  totalProducts: 6,
  totalUnitsSold: 32,
  totalRevenue: 4189.68,
  topProduct: "Blender"
};

function App() {
  const [currentView, setCurrentView] = useState("shop");
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [analyticsSummary, setAnalyticsSummary] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const [cartMessage, setCartMessage] = useState("");

  const API_BASE = "http://localhost:3001";

  const categories = useMemo(() => ["All", "Electronics", "Fashion", "Home"], []);

  const applyLocalFilters = () => {
    let filtered = [...fallbackProducts];

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (category !== "All") {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (minPrice) {
      filtered = filtered.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter((p) => p.price <= Number(maxPrice));
    }

    if (sort === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === "name_asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setProducts(filtered);
  };

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();

      if (searchQuery) params.append("q", searchQuery);
      if (category !== "All") params.append("category", category);
      if (minPrice) params.append("min_price", minPrice);
      if (maxPrice) params.append("max_price", maxPrice);
      if (sort) params.append("sort", sort);

      const queryString = params.toString();
      const url = queryString
        ? `${API_BASE}/api/products?${queryString}`
        : `${API_BASE}/api/products`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Backend unavailable");

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      applyLocalFilters();
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/analytics/products`);
      if (!response.ok) throw new Error("Backend unavailable");

      const data = await response.json();
      setAnalytics(data.analytics || []);
      setAnalyticsSummary(data.summary || null);
    } catch (error) {
      setAnalytics(fallbackAnalytics);
      setAnalyticsSummary(fallbackSummary);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchAnalytics();
  }, []);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setSort("");
    setProducts(fallbackProducts);
  };

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
    setShowCart(true);
    setCartMessage(`${product.name} added to cart`);

    setTimeout(() => {
      setCartMessage("");
    }, 2500);
  };

  const removeFromCart = (indexToRemove) => {
    setCart((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="page">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand" onClick={() => setCurrentView("shop")} style={{ cursor: "pointer" }}>
            <span className="brand-main">Mockup</span>
            <span className="brand-accent">Amazon</span>
          </div>

          <form className="header-search" onSubmit={handleApplyFilters}>
            <input
              type="text"
              placeholder="Search MockupAmazon products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          <div className="topbar-actions">
            <div
              className="topbar-link"
              onClick={() => user ? setUser(null) : setCurrentView("login")}
              style={{ cursor: "pointer" }}
            >
              <span className="small-text">Hello, {user ? user.name : "Guest"}</span>
              <span className="bold-text">{user ? "Sign Out" : "Account"}</span>
            </div>

            <div className="topbar-link" onClick={() => setCurrentView("shop")} style={{ cursor: "pointer" }}>
              <span className="small-text">Returns</span>
              <span className="bold-text">& Orders</span>
            </div>

            <div className="topbar-link" onClick={() => setCurrentView("stats")} style={{ cursor: "pointer" }}>
              <span className="small-text">Business</span>
              <span className="bold-text">Dashboard</span>
            </div>

            <button
              type="button"
              className="cart-box"
              onClick={toggleDarkMode}
              title="Toggle Dark Mode"
              style={{ fontSize: "1.2rem", padding: "0 8px" }}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            <button
              type="button"
              className="cart-box"
              onClick={() => setShowCart((prev) => !prev)}
            >
              <span className="cart-icon">🛒</span>
              <span className="cart-count">{cart.length}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="subbar">
        <div className="subbar-inner">
          <span>Today's Deals</span>
          <span>Customer Service</span>
          <span>Electronics</span>
          <span>Fashion</span>
          <span>Home</span>
        </div>
      </div>

      {cartMessage && <div className="cart-message">{cartMessage}</div>}

      <main className="main-content">
        {currentView === "login" ? (
          <LoginPage
            onLogin={(userData) => {
              setUser(userData);
              setCurrentView("shop");
            }}
            darkMode={darkMode}
          />
        ) : currentView === "shop" ? (
          <>
            <section className="hero">
          <div className="hero-overlay">
            <h1>Shop smart with MockupAmazon</h1>
            <p>
              Browse products, filter results, and simulate a real e-commerce
              experience with faster shopping and clearer product information.
            </p>
          </div>
        </section>

        <section className="filters-panel">
          <div className="filters-header">
            <h2>Filter Products</h2>
            <p>Use category, price range, and sorting to quickly find products.</p>
          </div>

          <form className="filters" onSubmit={handleApplyFilters}>
            <div className="field-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label>Minimum Price</label>
              <input
                type="number"
                placeholder="e.g. 25"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label>Maximum Price</label>
              <input
                type="number"
                placeholder="e.g. 120"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label>Sort By</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A-Z</option>
              </select>
            </div>

            <div className="filter-buttons">
              <button type="submit" className="apply-btn">
                Apply Filters
              </button>
              <button type="button" className="clear-btn" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          </form>
        </section>

        <section className="results-header">
          <h2>Results</h2>
          <p>{products.length} product(s) found</p>
        </section>

        {products.length === 0 ? (
          <section className="empty-results">
            <h3>No products found</h3>
            <p>Try changing your search, category, or price filters.</p>
          </section>
        ) : (
          <section className="product-grid">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.name} />
                </div>

                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="category-text">{product.category}</p>
                  <p className="rating-text">⭐⭐⭐⭐☆ {product.rating}</p>
                  <p className="description-text">{product.description}</p>
                  <p className="price-text">${product.price.toFixed(2)}</p>

                  <button className="cart-btn" onClick={() => addToCart(product)}>
                    Quick Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}

          </>
        ) : (
          <StatsPage analytics={analytics} summary={analyticsSummary} darkMode={darkMode} />
        )}
      </main>

      {showCart && (
        <>
          <div className="cart-overlay" onClick={() => setShowCart(false)}></div>

          <aside className="cart-drawer">
            <div className="cart-drawer-header">
              <h2>Shopping Cart</h2>
              <button
                type="button"
                className="close-cart-btn"
                onClick={() => setShowCart(false)}
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="empty-cart">Your cart is empty.</p>
            ) : (
              <>
                <div className="cart-list">
                  {cart.map((item, index) => (
                    <div className="cart-item" key={`${item.id}-${index}`}>
                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <p>${item.price.toFixed(2)}</p>
                      </div>

                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeFromCart(index)}
                      >
                        Remove Item
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-total">
                  <h3>Total: ${cartTotal.toFixed(2)}</h3>
                </div>
              </>
            )}
          </aside>
        </>
      )}
    </div>
  );
}

export default App;