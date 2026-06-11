import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Bell,
  ChevronDown,
  Heart,
  LogOut,
  Package,
  Search,
  ShoppingCart,
  Star,
  Store,
  Truck,
  User,
  Zap,
} from "lucide-react";
import { fetchProducts, type Product } from "../SellerDashboard/sellerApi";
import {
  addToCart,
  addToWishlist,
  fetchCart,
  fetchWishlist,
  removeFromCart,
  removeFromWishlist,
  type CartItem,
  type WishlistItem,
} from "../Customer/customerApi";
import { logout } from "../../store/substores/AuthStore";
import { clearAuthSession, getAuthSession } from "../../lib/authSession";
import BrandMark from "../../components/BrandMark";

const accentStyles = [
  "from-blue-100 via-cyan-100 to-sky-200",
  "from-yellow-100 via-amber-100 to-orange-200",
  "from-green-100 via-emerald-100 to-teal-200",
  "from-pink-100 via-rose-100 to-orange-100",
  "from-indigo-100 via-violet-100 to-blue-100",
];

const categoryIcons = ["Mobiles", "Fashion", "Electronics", "Home", "Beauty", "Appliances"];

const sortOptions = [
  { value: "featured", label: "Popularity" },
  { value: "price-low", label: "Price Low to High" },
  { value: "price-high", label: "Price High to Low" },
  { value: "stock", label: "Newest First" },
  { value: "name", label: "Name" },
] as const;

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const getAccentStyle = (productId: number) => accentStyles[productId % accentStyles.length];

const getRating = (product: Product) => (4 + (product.id % 9) / 10).toFixed(1);

const getDiscount = (product: Product) => {
  if (product.price >= 50000) return 22;
  if (product.price >= 10000) return 18;
  if (product.stockQuantity <= 5) return 10;
  return 14 + (product.id % 5);
};

const getProductImage = (product: Product) => {
  if (product.imageUrl && product.imageUrl.trim().length > 0) {
    return <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain" />;
  }

  return (
    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${getAccentStyle(product.id)}`}>
      <span className="text-4xl font-semibold text-blue-950/65">
        {product.name.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username] = useState(() => getAuthSession().username || "Customer");
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<(typeof sortOptions)[number]["value"]>("featured");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setError("");
        const [productsData, cartData, wishlistData] = await Promise.all([
          fetchProducts(),
          fetchCart(),
          fetchWishlist(),
        ]);
        setProducts(productsData);
        setCartItems(cartData);
        setWishlistItems(wishlistData);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load dashboard.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(new Set(products.map((product) => product.category))).sort((a, b) => a.localeCompare(b)),
    ],
    [products],
  );

  const filteredProducts = [...products]
    .filter((product) => {
      const searchValue = searchTerm.trim().toLowerCase();
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch =
        searchValue.length === 0 ||
        [product.name, product.category, product.description].join(" ").toLowerCase().includes(searchValue);

      return matchesCategory && matchesSearch;
    })
    .sort((left, right) => {
      if (sortBy === "price-low") return left.price - right.price;
      if (sortBy === "price-high") return right.price - left.price;
      if (sortBy === "stock") return right.id - left.id;
      if (sortBy === "name") return left.name.localeCompare(right.name);
      return right.stockQuantity - left.stockQuantity;
    });

  const topCategories = categories.filter((category) => category !== "All").slice(0, 8);
  const cartProductIds = new Set(cartItems.map((item) => item.productId));
  const wishlistProductIds = new Set(wishlistItems.map((item) => item.productId));
  const cartCount = cartItems.length;
  const wishlistCount = wishlistItems.length;

  const handleWishlistToggle = async (productId: number) => {
    try {
      setActionError("");
      const updated = wishlistProductIds.has(productId)
        ? await removeFromWishlist(productId)
        : await addToWishlist(productId);
      setWishlistItems(updated);
    } catch (wishlistError) {
      setActionError(wishlistError instanceof Error ? wishlistError.message : "Failed to update wishlist.");
    }
  };

  const handleCartToggle = async (productId: number) => {
    try {
      setActionError("");
      const updated = cartProductIds.has(productId)
        ? await removeFromCart(productId)
        : await addToCart(productId, 1);
      setCartItems(updated);
    } catch (cartError) {
      setActionError(cartError instanceof Error ? cartError.message : "Failed to update cart.");
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    dispatch(logout());
    setIsLogoutDialogOpen(false);
    setIsAccountMenuOpen(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f4f7f8] text-[#0f172a]">
      <header className="sticky top-0 z-30 border-b border-teal-950/10 bg-white/85 text-slate-900 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <button type="button" onClick={() => navigate("/dashboard")} className="shrink-0 text-left">
            <BrandMark />
          </button>

          <div className="relative hidden flex-1 md:block">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-teal-600" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search for products, brands and more"
              className="h-10 w-full rounded-sm bg-white pl-12 pr-4 text-sm text-slate-900 shadow outline-none"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsAccountMenuOpen((current) => !current)}
              className="inline-flex h-9 items-center gap-2 rounded-sm bg-teal-600 px-5 text-sm font-semibold text-white"
            >
              <User className="h-4 w-4" />
              {username}
              <ChevronDown className="h-4 w-4" />
            </button>

            {isAccountMenuOpen ? (
              <div className="absolute right-0 top-12 z-40 w-56 border border-slate-200 bg-white py-2 text-slate-800 shadow-xl">
                <button
                  type="button"
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-slate-50"
                >
                  <User className="h-4 w-4 text-teal-600" />
                  My Profile
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/orders")}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-slate-50"
                >
                  <Package className="h-4 w-4 text-teal-600" />
                  Orders
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAccountMenuOpen(false);
                    setIsLogoutDialogOpen(true);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : null}
          </div>

          <button type="button" className="hidden items-center gap-2 text-sm font-semibold lg:inline-flex">
            <Store className="h-5 w-5" />
            Become a Seller
          </button>
          <button type="button" onClick={() => navigate("/wishlist")} className="relative inline-flex items-center gap-2 text-sm font-semibold">
            <Heart className="h-5 w-5" />
            <span className="hidden sm:inline">Wishlist</span>
            {wishlistCount > 0 ? (
              <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-300 px-1 text-xs text-slate-950">
                {wishlistCount}
              </span>
            ) : null}
          </button>
          <button type="button" onClick={() => navigate("/cart")} className="relative inline-flex items-center gap-2 text-sm font-semibold">
            <ShoppingCart className="h-5 w-5" />
            Cart
            {cartCount > 0 ? (
              <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-300 px-1 text-xs text-slate-950">
                {cartCount}
              </span>
            ) : null}
          </button>
        </div>

        <div className="px-4 pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-teal-600" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search for products, brands and more"
              className="h-10 w-full rounded-sm bg-white pl-12 pr-4 text-sm text-slate-900 shadow outline-none"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-3 py-3 sm:px-4">
        <section className="mb-3 overflow-x-auto bg-white shadow-sm">
          <div className="flex min-w-max items-center justify-between gap-8 px-5 py-3">
            {["Top Offers", ...topCategories, ...categoryIcons].slice(0, 10).map((category, index) => (
              <button
                key={`${category}-${index}`}
                type="button"
                onClick={() => setSelectedCategory(categories.includes(category) ? category : "All")}
                className={`flex min-w-20 flex-col items-center gap-2 text-xs font-semibold ${
                  selectedCategory === category ? "text-teal-700" : "text-slate-800"
                }`}
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f1f3f6] text-lg">
                  {category.slice(0, 1)}
                </span>
                {category}
              </button>
            ))}
          </div>
        </section>

        {error ? <div className="mb-3 border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
        {actionError ? (
          <div className="mb-3 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">{actionError}</div>
        ) : null}

        <section className="mb-3 grid gap-3 lg:grid-cols-[2fr_1fr]">
          <div className="flex min-h-56 flex-col justify-center bg-[linear-gradient(100deg,#0f766e_0%,#14b8a6_50%,#f59e0b_100%)] px-8 py-8 text-white shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">Big Saving Days</p>
            <h1 className="mt-3 max-w-xl text-4xl font-bold leading-tight">
              Deals that feel like the Localkart neighborhood rush.
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-blue-50">
              Live products, real cart state, wishlist, sorting, filters, and marketplace-style product cards.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => setSortBy("price-low")} className="bg-white px-5 py-3 text-sm font-semibold text-teal-700">
                Shop lowest prices
              </button>
              <button type="button" onClick={() => navigate("/orders")} className="border border-white/70 px-5 py-3 text-sm font-semibold text-white">
                Track orders
              </button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="flex items-center gap-4 bg-white p-5 shadow-sm">
                  <Truck className="h-9 w-9 text-teal-600" />
              <div>
                <p className="font-semibold">Free delivery</p>
                <p className="text-sm text-slate-500">On selected products</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-5 shadow-sm">
              <Zap className="h-9 w-9 text-amber-500" />
              <div>
                <p className="font-semibold">Flash offers</p>
                <p className="text-sm text-slate-500">Fresh deals every day</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-5 shadow-sm">
              <Bell className="h-9 w-9 text-teal-600" />
              <div>
                <p className="font-semibold">{filteredProducts.length} results</p>
                <p className="text-sm text-slate-500">From your live catalog</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-3 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="h-max bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-4">
              <p className="text-lg font-semibold">Filters</p>
            </div>
            <div className="border-b border-slate-200 px-4 py-4">
              <p className="mb-3 text-xs font-semibold uppercase text-slate-500">Categories</p>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`block w-full text-left text-sm ${
                      selectedCategory === category ? "font-semibold text-teal-700" : "text-slate-700 hover:text-teal-700"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-b border-slate-200 px-4 py-4">
              <p className="mb-3 text-xs font-semibold uppercase text-slate-500">Sort by</p>
              <div className="space-y-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSortBy(option.value)}
                    className={`block w-full text-left text-sm ${
                      sortBy === option.value ? "font-semibold text-teal-700" : "text-slate-700 hover:text-teal-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-4 py-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Customer protection</p>
              <p className="mt-1">Easy returns, secure checkout, and verified seller style badges.</p>
            </div>
          </aside>

          <section className="bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Products for you</h2>
                <p className="text-sm text-slate-500">
                  {isLoading ? "Loading catalog..." : `Showing ${filteredProducts.length} of ${products.length} products`}
                </p>
              </div>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as (typeof sortOptions)[number]["value"])}
                className="h-10 border border-slate-200 bg-white px-3 text-sm outline-none focus:border-teal-600"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    Sort: {option.label}
                  </option>
                ))}
              </select>
            </div>

            {isLoading ? (
              <div className="grid gap-0 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={`loading-${index}`} className="border-b border-r border-slate-100 p-5">
                    <div className="h-56 animate-pulse bg-slate-100" />
                    <div className="mt-5 space-y-3">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
                      <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid gap-0 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => {
                  const isWishlisted = wishlistProductIds.has(product.id);
                  const isInCart = cartProductIds.has(product.id);
                  const discount = getDiscount(product);
                  const originalPrice = Math.round(product.price / (1 - discount / 100));

                  return (
                    <article key={product.id} className="group border-b border-r border-slate-100 p-5 transition hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)]">
                      <div className="relative h-56 cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
                        {getProductImage(product)}
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            void handleWishlistToggle(product.id);
                          }}
                          className={`absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow ${
                            isWishlisted ? "text-rose-500" : "text-slate-400"
                          }`}
                          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          <Heart className={isWishlisted ? "h-5 w-5 fill-current" : "h-5 w-5"} />
                        </button>
                      </div>

                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase text-slate-400">{product.category}</p>
                        <button
                          type="button"
                          onClick={() => navigate(`/products/${product.id}`)}
                          className="mt-1 line-clamp-2 min-h-11 text-left text-sm font-semibold text-slate-900 hover:text-teal-700"
                        >
                          {product.name}
                        </button>
                        <p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500">{product.description}</p>

                        <div className="mt-3 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-sm bg-emerald-600 px-1.5 py-0.5 text-xs font-semibold text-white">
                            {getRating(product)} <Star className="h-3 w-3 fill-white" />
                          </span>
                          <span className="text-xs font-medium text-slate-500">({product.stockQuantity * 13 + product.id})</span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-baseline gap-2">
                          <span className="text-xl font-semibold text-slate-950">{formatPrice(product.price)}</span>
                          <span className="text-sm text-slate-400 line-through">{formatPrice(originalPrice)}</span>
                          <span className="text-sm font-semibold text-emerald-600">{discount}% off</span>
                        </div>

                        <div className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-600">
                          <Truck className="h-4 w-4 text-emerald-600" />
                          Free delivery by tomorrow
                        </div>

                        <div className="mt-4 flex gap-2">
                          <button
                            type="button"
                            onClick={() => void handleCartToggle(product.id)}
                            className={`flex-1 px-3 py-2 text-sm font-semibold text-white ${
                              isInCart ? "bg-teal-600" : "bg-amber-500"
                            }`}
                          >
                            {isInCart ? "Added" : "Add to Cart"}
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/products/${product.id}`)}
                            className="flex-1 bg-[linear-gradient(135deg,#0f766e_0%,#14b8a6_70%,#f59e0b_100%)] px-3 py-2 text-sm font-semibold text-white"
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="px-5 py-16 text-center text-sm text-slate-500">
                No products matched the current search and category filters.
              </div>
            )}
          </section>
        </div>
      </main>

      {isLogoutDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
          <div className="w-full max-w-md bg-white p-6 shadow-2xl">
            <p className="text-lg font-semibold text-slate-900">Logout from Localkart?</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              You will be signed out and returned to the login page.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsLogoutDialogOpen(false)}
                className="border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700"
              >
                Cancel
              </button>
              <button type="button" onClick={handleLogout} className="bg-teal-600 px-4 py-3 text-sm font-semibold text-white">
                Logout
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Dashboard;
