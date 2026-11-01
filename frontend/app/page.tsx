"use client";

import {
  ArrowDownWideNarrow,
  ArrowRight,
  ArrowUpRight,
  BadgePercent,
  Boxes,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CircleHelp,
  Eye,
  Heart,
  LayoutDashboard,
  LoaderCircle,
  Plus,
  Search,
  Sparkles,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Category = {
  name: string;
  description?: string | null;
};

type Product = {
  id: number;
  name: string;
  price: number;
  description?: string | null;
  category?: Category | null;
  imageUrl?: string | null;
};

type SearchResults = {
  content: Product[];
};

type Toast = {
  message: string;
  type: "success" | "error";
};

const FAVORITES_STORAGE_KEY = "product-catalog-favorites";
const PAGE_SIZE = 8;

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(price);
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [appliedRange, setAppliedRange] = useState<{ min: string; max: string } | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pitch, setPitch] = useState<{ name: string; text: string } | null>(null);
  const [pitchLoading, setPitchLoading] = useState<number | null>(null);
  const [average, setAverage] = useState<number | null>(null);
  const [averageLoading, setAverageLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [favoritesReady, setFavoritesReady] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (appliedRange) {
        const path = `/products/search?minPrice=${encodeURIComponent(appliedRange.min)}&maxPrice=${encodeURIComponent(appliedRange.max)}&page=0&size=100&sort=price,asc`;
        const result = await apiRequest<SearchResults>(path);
        setProducts(result.content ?? []);
      } else {
        setProducts(await apiRequest<Product[]>("/products"));
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not load products from the catalog service.",
      );
    } finally {
      setLoading(false);
    }
  }, [appliedRange]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    try {
      const savedFavorites = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavorites) {
        const parsedFavorites: unknown = JSON.parse(savedFavorites);
        if (
          Array.isArray(parsedFavorites) &&
          parsedFavorites.every((id) => typeof id === "number" && Number.isFinite(id))
        ) {
          setFavoriteIds(parsedFavorites);
        }
      }
    } catch {
      setToast({ message: "Could not load saved favorites from this browser.", type: "error" });
    } finally {
      setFavoritesReady(true);
    }
  }, []);

  useEffect(() => {
    if (!favoritesReady) return;
    try {
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch {
      setToast({ message: "Could not save favorites in this browser.", type: "error" });
    }
  }, [favoriteIds, favoritesReady]);

  useEffect(() => {
    if (!toast) return;
    const timeoutId = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map((product) => product.category?.name)
            .filter((name): name is string => Boolean(name)),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [products],
  );

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filteredProducts = products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        product.name?.toLowerCase().includes(normalizedQuery) ||
        product.description?.toLowerCase().includes(normalizedQuery);
      const matchesCategory =
        categoryFilter === "All categories" ||
        product.category?.name === categoryFilter;
      const matchesFavorites = !showFavorites || favoriteIds.includes(product.id);
      return matchesQuery && matchesCategory && matchesFavorites;
    });
    return [...filteredProducts].sort((first, second) => {
      switch (sortOrder) {
        case "name-desc":
          return second.name.localeCompare(first.name);
        case "price-asc":
          return first.price - second.price;
        case "price-desc":
          return second.price - first.price;
        default:
          return first.name.localeCompare(second.name);
      }
    });
  }, [categoryFilter, favoriteIds, products, query, showFavorites, sortOrder]);

  const pageCount = Math.max(1, Math.ceil(visibleProducts.length / PAGE_SIZE));
  const paginatedProducts = visibleProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, query, showFavorites, sortOrder]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, pageCount));
  }, [pageCount]);

  function toggleFavorite(product: Product) {
    const isFavorite = favoriteIds.includes(product.id);
    setFavoriteIds((current) =>
      isFavorite ? current.filter((id) => id !== product.id) : [...current, product.id],
    );
    setToast({
      message: isFavorite
        ? `${product.name} removed from favorites.`
        : `${product.name} added to favorites.`,
      type: "success",
    });
  }

  useEffect(() => {
    if (categoryFilter !== "All categories") {
      let ignored = false;
      setAverageLoading(true);
      setAverage(null);
      apiRequest<number | null>(`/categories/${encodeURIComponent(categoryFilter)}`)
        .then((value) => {
          if (!ignored) setAverage(value);
        })
        .catch((requestError: unknown) => {
          if (ignored) return;
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Could not load the category average.",
          );
        })
        .finally(() => {
          if (!ignored) setAverageLoading(false);
        });
      return () => {
        ignored = true;
      };
    } else {
      setAverage(null);
    }
  }, [categoryFilter]);

  async function applyPriceRange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const min = Number(minPrice);
    const max = Number(maxPrice);
    if (!minPrice || !maxPrice || !Number.isFinite(min) || !Number.isFinite(max) || min > max) {
      setError("Enter a valid minimum and maximum price, with the minimum no greater than the maximum.");
      return;
    }
    setError("");
    setAppliedRange({ min: minPrice, max: maxPrice });
  }

  function clearPriceRange() {
    setAppliedRange(null);
    setMinPrice("");
    setMaxPrice("");
  }

  async function createProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const categoryName = String(formData.get("category") ?? "").trim();
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      price: Number(formData.get("price")),
      description: String(formData.get("description") ?? "").trim(),
      imageUrl: String(formData.get("imageUrl") ?? "").trim(),
      category: categoryName ? { name: categoryName } : null,
    };

    setIsSaving(true);
    setError("");
    try {
      await apiRequest<Product>("/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setIsCreateOpen(false);
      await loadProducts();
      setToast({ message: "Product added to your catalog.", type: "success" });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not create the product.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function generatePitch(product: Product) {
    setPitchLoading(product.id);
    setError("");
    try {
      const response = await apiRequest<{ id: number; pitch: string }>(
        `/products/${product.id}/pitch`,
      );
      setPitch({ name: product.name, text: response.pitch });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not generate a product pitch.",
      );
    } finally {
      setPitchLoading(null);
    }
  }

  async function deleteProduct(product: Product) {
    if (!window.confirm(`Remove "${product.name}" from the catalog?`)) return;
    setError("");
    try {
      await apiRequest<void>(`/products/${product.id}`, { method: "DELETE" });
      setProducts((current) => current.filter((item) => item.id !== product.id));
      setFavoriteIds((current) => current.filter((id) => id !== product.id));
      if (selectedProduct?.id === product.id) setSelectedProduct(null);
      setToast({ message: "Product removed from your catalog.", type: "success" });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not remove the product.",
      );
    }
  }

  const averageLabel = averageLoading
    ? "Loading…"
    : average === null
      ? "No average available"
      : formatPrice(average);

  return (
    <main className="page-enter min-h-screen md:flex">
      <aside className="flex w-full shrink-0 flex-col border-b border-[var(--line)] bg-white md:min-h-screen md:w-[244px] md:border-b-0 md:border-r">
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--green)] text-white">
            <Boxes size={19} strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-[15px] font-bold tracking-[-0.03em]">fieldnotes</p>
            <p className="text-[11px] text-[var(--muted)]">PRODUCT STUDIO</p>
          </div>
          <button
            aria-label="Switch workspace"
            className="ml-auto rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--canvas)]"
          >
            <ChevronDown size={16} />
          </button>
        </div>

        <div className="px-4 pt-3">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#a2aaa4]">
            Workspace
          </p>
          <nav className="space-y-1">
            <a
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                !showFavorites
                  ? "bg-[#edf4ee] font-semibold text-[var(--green-dark)]"
                  : "text-[#68736c] hover:bg-[var(--canvas)]"
              }`}
              href="#catalog"
              onClick={() => setShowFavorites(false)}
            >
              <LayoutDashboard size={17} />
              Overview
            </a>
            <button
              aria-pressed={showFavorites}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium ${
                showFavorites
                  ? "bg-[#edf4ee] text-[var(--green-dark)]"
                  : "text-[#68736c] hover:bg-[var(--canvas)]"
              }`}
              onClick={() => setShowFavorites(true)}
              type="button"
            >
              <Heart size={17} />
              Favorites
              <span className="ml-auto rounded-full bg-[#f0f2ee] px-2 py-0.5 text-[11px] text-[#657169]">
                {favoriteIds.length}
              </span>
            </button>
            <a
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#68736c] hover:bg-[var(--canvas)]"
              href="#insights"
            >
              <BadgePercent size={17} />
              Insights
            </a>
          </nav>
        </div>

        <div className="mt-8 hidden px-4 md:block">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#a2aaa4]">
            Collections
          </p>
          <div className="space-y-1">
            {categories.slice(0, 5).map((category, index) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-[#68736c] hover:bg-[var(--canvas)]"
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    index % 3 === 0
                      ? "bg-[#c58d5b]"
                      : index % 3 === 1
                        ? "bg-[#7ba388]"
                        : "bg-[#8497ad]"
                  }`}
                />
                <span className="truncate">{category}</span>
              </button>
            ))}
            {categories.length === 0 && (
              <p className="px-3 py-2 text-xs text-[#9aa29c]">Categories appear here</p>
            )}
          </div>
        </div>

        <div className="mt-auto hidden p-4 md:block">
          <div className="rounded-2xl bg-[#f5f6f2] p-4">
            <div className="mb-2 flex items-center gap-2 text-[var(--green)]">
              <CircleHelp size={16} />
              <span className="text-xs font-semibold">Need a hand?</span>
            </div>
            <p className="text-xs leading-5 text-[#77817b]">
              Your catalog is connected directly to the Product Catalog API.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-3 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dce8df] text-xs font-bold text-[var(--green-dark)]">
              PS
            </div>
            <div>
              <p className="text-xs font-semibold">Product team</p>
              <p className="text-[11px] text-[var(--muted)]">Workspace admin</p>
            </div>
            <button aria-label="Open account menu" className="ml-auto text-[#8b948e]">
              <ChevronDown size={15} />
            </button>
          </div>
        </div>
      </aside>

      <section className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-[var(--line)] bg-white px-5 py-4 sm:px-8">
          <div>
            <p className="text-xs text-[#929b95]">Workspace / Catalog</p>
            <h1 className="mt-1 text-[15px] font-semibold tracking-[-0.02em]">Overview</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full bg-[#f2f5f1] px-3 py-1.5 text-[11px] font-medium text-[#627168] sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#58a66f]" />
              API connected
            </span>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-[var(--green)] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--green-dark)]"
            >
              <Plus size={15} />
              Add product
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10">
          <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.13em] text-[var(--green)]">
                Monday, your catalog is looking good
              </p>
              <h2 className="text-3xl font-semibold tracking-[-0.055em] sm:text-[38px]">
                Product overview<span className="text-[#91ad98]">.</span>
              </h2>
              <p className="mt-2 text-sm text-[#79837d]">
                Keep every detail in one considered place.
              </p>
            </div>
            <button
              onClick={() => void loadProducts()}
              className="flex w-fit items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#56635b] hover:bg-[#fafbf8]"
            >
              <ArrowDownWideNarrow size={15} />
              Refresh catalog
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-[#f1d2c8] bg-[#fff7f4] px-4 py-3 text-sm text-[#923f2e]"
            >
              <span>{error}</span>
              <button aria-label="Dismiss error" onClick={() => setError("")}>
                <X size={16} />
              </button>
            </div>
          )}

          <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              label="Total products"
              value={loading ? "—" : products.length.toString()}
              detail="In your catalog"
              icon={<Boxes size={18} />}
              accent="green"
            />
            <StatCard
              label="Categories"
              value={loading ? "—" : categories.length.toString()}
              detail="Distinct collections"
              icon={<Tag size={18} />}
              accent="sand"
            />
            <StatCard
              label={categoryFilter === "All categories" ? "Category average" : `${categoryFilter} average`}
              value={categoryFilter === "All categories" ? "Choose a category" : averageLabel}
              detail="Live from your catalog"
              icon={<BadgePercent size={18} />}
              accent="blue"
              id="insights"
            />
          </div>

          <section id="catalog" className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white">
            <div className="flex flex-col gap-4 border-b border-[var(--line)] px-5 py-5 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold tracking-[-0.025em]">
                    {showFavorites ? "Favorite products" : "Your products"}
                  </h3>
                  <p className="mt-1 text-xs text-[#88918b]">
                    {visibleProducts.length} {visibleProducts.length === 1 ? "item" : "items"} in view
                    {appliedRange && " · price range applied"}
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-[#f4f6f2] px-3 py-2 text-[11px] font-medium text-[#67736b]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#59a472]" />
                  Synced with backend
                </div>
              </div>
              <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
                <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-[var(--line)] px-3 py-2.5 text-[#8b958e] focus-within:border-[#a7c3ad]">
                  <Search size={16} />
                  <input
                    aria-label="Search products"
                    className="w-full bg-transparent text-xs text-[var(--ink)] outline-none placeholder:text-[#a3aaa5]"
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search products..."
                    value={query}
                  />
                </label>
                <select
                  aria-label="Filter by category"
                  className="rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-xs text-[#59665e] outline-none focus:border-[#a7c3ad]"
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  value={categoryFilter}
                >
                  <option>All categories</option>
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
                <select
                  aria-label="Sort products"
                  className="rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-xs text-[#59665e] outline-none focus:border-[#a7c3ad]"
                  onChange={(event) => setSortOrder(event.target.value)}
                  value={sortOrder}
                >
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                </select>
                <form onSubmit={applyPriceRange} className="flex items-center gap-2">
                  <input
                    aria-label="Minimum price"
                    className="w-[100px] rounded-xl border border-[var(--line)] px-3 py-2.5 text-xs outline-none focus:border-[#a7c3ad]"
                    min="0"
                    onChange={(event) => setMinPrice(event.target.value)}
                    placeholder="Min $"
                    step="0.01"
                    type="number"
                    value={minPrice}
                  />
                  <span className="text-xs text-[#a1aaa3]">to</span>
                  <input
                    aria-label="Maximum price"
                    className="w-[100px] rounded-xl border border-[var(--line)] px-3 py-2.5 text-xs outline-none focus:border-[#a7c3ad]"
                    min="0"
                    onChange={(event) => setMaxPrice(event.target.value)}
                    placeholder="Max $"
                    step="0.01"
                    type="number"
                    value={maxPrice}
                  />
                  <button
                    aria-label="Apply price range"
                    className="rounded-xl border border-[var(--line)] p-2.5 text-[#647168] hover:bg-[#f5f7f3]"
                    type="submit"
                  >
                    <ArrowRight size={15} />
                  </button>
                  {appliedRange && (
                    <button
                      aria-label="Clear price range"
                      className="rounded-lg p-2 text-[#7b867e] hover:bg-[#f5f7f3]"
                      onClick={clearPriceRange}
                      type="button"
                    >
                      <X size={15} />
                    </button>
                  )}
                </form>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--line)] bg-[#fbfcfa] text-[10px] font-semibold uppercase tracking-[0.1em] text-[#929b95]">
                    <th className="px-6 py-3.5 font-semibold">Product</th>
                    <th className="px-4 py-3.5 font-semibold">Category</th>
                    <th className="px-4 py-3.5 font-semibold">Price</th>
                    <th className="px-4 py-3.5 font-semibold">Description</th>
                    <th className="px-6 py-3.5 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }, (_, index) => (
                      <tr className="border-b border-[#f0f1ed] last:border-0" key={index}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="skeleton h-11 w-11 rounded-xl" />
                            <span className="space-y-2">
                              <span className="skeleton block h-3 w-32 rounded" />
                              <span className="skeleton block h-2.5 w-20 rounded" />
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4"><span className="skeleton block h-5 w-20 rounded-full" /></td>
                        <td className="px-4 py-4"><span className="skeleton block h-3 w-14 rounded" /></td>
                        <td className="px-4 py-4"><span className="skeleton block h-3 w-36 rounded" /></td>
                        <td className="px-6 py-4"><span className="skeleton ml-auto block h-7 w-16 rounded-lg" /></td>
                      </tr>
                    ))
                  ) : visibleProducts.length === 0 ? (
                    <tr>
                      <td className="px-6 py-16 text-center" colSpan={5}>
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2f5f1] text-[var(--green)]">
                          <Boxes size={19} />
                        </div>
                        <p className="mt-3 text-sm font-semibold">Nothing here yet</p>
                        <p className="mt-1 text-xs text-[#8b958e]">
                          Try another search or add your first product.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="product-row border-b border-[#f0f1ed] last:border-0 hover:bg-[#fcfdfa]"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f0f3ee] text-[var(--green)]">
                              {product.imageUrl ? (
                                // Catalog image URLs are supplied by the backend, so use a plain image element.
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  alt=""
                                  className="h-full w-full object-cover"
                                  src={product.imageUrl}
                                />
                              ) : (
                                <Tag size={17} />
                              )}
                            </div>
                            <div className="min-w-0">
                              <button
                                className="max-w-full truncate text-left text-xs font-semibold text-[#29352e] hover:text-[var(--green)]"
                                onClick={() => setSelectedProduct(product)}
                                type="button"
                              >
                                {product.name}
                              </button>
                              <p className="mt-1 text-[10px] text-[#a0a8a2]">
                                Product #{product.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {product.category?.name ? (
                            <span className="rounded-full bg-[#f3f5f1] px-2.5 py-1 text-[10px] font-medium text-[#647168]">
                              {product.category.name}
                            </span>
                          ) : (
                            <span className="text-xs text-[#a0a8a2]">Uncategorized</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-xs font-semibold text-[#39463e]">
                          {formatPrice(product.price)}
                        </td>
                        <td className="max-w-[240px] px-4 py-4">
                          <p className="truncate text-xs text-[#838d86]">
                            {product.description || "—"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-1">
                            <button
                              aria-label={`${favoriteIds.includes(product.id) ? "Remove" : "Add"} ${product.name} ${favoriteIds.includes(product.id) ? "from" : "to"} favorites`}
                              aria-pressed={favoriteIds.includes(product.id)}
                              className={`rounded-lg p-2 ${
                                favoriteIds.includes(product.id)
                                  ? "text-[#bd5942] hover:bg-[#fff1ed]"
                                  : "text-[#a0a8a2] hover:bg-[#fff1ed] hover:text-[#bd5942]"
                              }`}
                              onClick={() => toggleFavorite(product)}
                              title={favoriteIds.includes(product.id) ? "Remove from favorites" : "Add to favorites"}
                              type="button"
                            >
                              <Heart fill={favoriteIds.includes(product.id) ? "currentColor" : "none"} size={15} />
                            </button>
                            <button
                              aria-label={`View ${product.name} details`}
                              className="rounded-lg p-2 text-[#819087] hover:bg-[#edf4ee] hover:text-[var(--green)]"
                              onClick={() => setSelectedProduct(product)}
                              title="View product details"
                              type="button"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              aria-label={`Generate pitch for ${product.name}`}
                              className="rounded-lg p-2 text-[#819087] hover:bg-[#edf4ee] hover:text-[var(--green)]"
                              disabled={pitchLoading === product.id}
                              onClick={() => void generatePitch(product)}
                              title="Generate product pitch"
                            >
                              {pitchLoading === product.id ? (
                                <LoaderCircle className="animate-spin" size={15} />
                              ) : (
                                <Sparkles size={15} />
                              )}
                            </button>
                            <button
                              aria-label={`Delete ${product.name}`}
                              className="rounded-lg p-2 text-[#a0a8a2] hover:bg-[#fff1ed] hover:text-[#bd5942]"
                              onClick={() => void deleteProduct(product)}
                              title="Remove product"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--line)] px-6 py-3.5 text-[11px] text-[#929b95]">
              <span>
                Showing {visibleProducts.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, visibleProducts.length)} of {visibleProducts.length}
              </span>
              <div aria-label="Product pages" className="flex items-center gap-2">
                <button
                  aria-label="Previous page"
                  className="rounded-lg border border-[var(--line)] p-1.5 text-[#647168] transition hover:bg-[#f5f7f3] disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  type="button"
                >
                  <ChevronLeft size={15} />
                </button>
                <span>Page {currentPage} of {pageCount}</span>
                <button
                  aria-label="Next page"
                  className="rounded-lg border border-[var(--line)] p-1.5 text-[#647168] transition hover:bg-[#f5f7f3] disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={currentPage === pageCount}
                  onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
                  type="button"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
              <span className="flex items-center gap-1.5">
                <Check size={13} className="text-[var(--green)]" />
                Changes sync with your backend
              </span>
            </div>
          </section>

          <footer className="flex flex-col justify-between gap-2 py-6 text-[10px] text-[#a0a8a2] sm:flex-row">
            <span>Made for people who care about the little details.</span>
            <span className="flex items-center gap-1.5">
              View API-backed catalog <ArrowUpRight size={12} />
            </span>
          </footer>
        </div>
      </section>

      {isCreateOpen && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-[#16231d]/35 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsCreateOpen(false);
          }}
        >
          <div className="modal-enter w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--green)]">
                  Catalog
                </p>
                <h3 className="mt-1 text-xl font-semibold tracking-[-0.04em]">Add a product</h3>
              </div>
              <button
                aria-label="Close form"
                className="rounded-lg p-2 text-[#859087] hover:bg-[#f3f5f1]"
                onClick={() => setIsCreateOpen(false)}
              >
                <X size={17} />
              </button>
            </div>
            <form className="space-y-4" onSubmit={(event) => void createProduct(event)}>
              <FormField label="Product name" name="name" required />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Price (USD)" name="price" min="0" step="0.01" type="number" required />
                <FormField label="Category" name="category" list="category-options" />
                <datalist id="category-options">
                  {categories.map((category) => <option key={category} value={category} />)}
                </datalist>
                <FormField label="Image URL" name="imageUrl" type="url" />
              </div>
              <label className="block text-xs font-medium text-[#59665e]">
                Description
                <textarea
                  className="mt-1.5 min-h-24 w-full resize-y rounded-xl border border-[var(--line)] px-3 py-2.5 text-sm outline-none focus:border-[#a7c3ad]"
                  name="description"
                  placeholder="What makes this product special?"
                  rows={3}
                />
              </label>
              <div className="flex justify-end gap-2 border-t border-[var(--line)] pt-4">
                <button
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold text-[#647168] hover:bg-[#f4f6f2]"
                  onClick={() => setIsCreateOpen(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="flex items-center gap-2 rounded-xl bg-[var(--green)] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[var(--green-dark)] disabled:opacity-60"
                  disabled={isSaving}
                  type="submit"
                >
                  {isSaving && <LoaderCircle className="animate-spin" size={14} />}
                  Add product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {pitch && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#16231d]/35 p-4">
          <section
            aria-labelledby="pitch-title"
            aria-modal="true"
            className="modal-enter w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            role="dialog"
          >
            <div className="mb-5 flex items-start justify-between">
              <div className="flex items-center gap-2 text-[var(--green)]">
                <Sparkles size={17} />
                <span className="text-xs font-semibold uppercase tracking-[0.12em]">Product pitch</span>
              </div>
              <button
                aria-label="Close product pitch"
                className="rounded-lg p-2 text-[#859087] hover:bg-[#f3f5f1]"
                onClick={() => setPitch(null)}
              >
                <X size={17} />
              </button>
            </div>
            <h3 className="text-xl font-semibold tracking-[-0.04em]" id="pitch-title">
              {pitch.name}
            </h3>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#69756d]">{pitch.text}</p>
          </section>
        </div>
      )}

      {selectedProduct && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-[#16231d]/40 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedProduct(null);
          }}
        >
          <section
            aria-labelledby="product-details-title"
            aria-modal="true"
            className="modal-enter w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
            role="dialog"
          >
            <div className="relative flex h-52 items-center justify-center bg-[#f0f3ee] text-[var(--green)]">
              {selectedProduct.imageUrl ? (
                // Catalog image URLs are supplied by the backend, so use a plain image element.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={selectedProduct.name}
                  className="h-full w-full object-cover"
                  src={selectedProduct.imageUrl}
                />
              ) : (
                <Tag size={40} strokeWidth={1.5} />
              )}
              <button
                aria-label="Close product details"
                className="absolute right-4 top-4 rounded-lg bg-white/90 p-2 text-[#59665e] transition hover:bg-white"
                onClick={() => setSelectedProduct(null)}
                type="button"
              >
                <X size={17} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-[#929b95]">
                    {selectedProduct.category?.name || "Uncategorized"} · Product #{selectedProduct.id}
                  </p>
                  <h3
                    className="mt-2 text-2xl font-semibold tracking-[-0.04em]"
                    id="product-details-title"
                  >
                    {selectedProduct.name}
                  </h3>
                </div>
                <p className="shrink-0 text-lg font-semibold text-[var(--green)]">
                  {formatPrice(selectedProduct.price)}
                </p>
              </div>
              <p className="mt-5 text-sm leading-6 text-[#69756d]">
                {selectedProduct.description || "No description has been added for this product."}
              </p>
              <div className="mt-6 flex justify-end border-t border-[var(--line)] pt-4">
                <button
                  className="flex items-center gap-2 rounded-xl border border-[var(--line)] px-4 py-2.5 text-xs font-semibold text-[#59665e] transition hover:bg-[#f5f7f3]"
                  onClick={() => toggleFavorite(selectedProduct)}
                  type="button"
                >
                  <Heart
                    fill={favoriteIds.includes(selectedProduct.id) ? "currentColor" : "none"}
                    size={15}
                  />
                  {favoriteIds.includes(selectedProduct.id)
                    ? "Remove from favorites"
                    : "Add to favorites"}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {toast && (
        <div
          aria-live="polite"
          className={`toast-enter fixed bottom-5 right-5 z-40 flex max-w-sm items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg ${
            toast.type === "success"
              ? "border-[#cfe0d2] bg-white text-[#315d40]"
              : "border-[#f1d2c8] bg-white text-[#923f2e]"
          }`}
          role="status"
        >
          {toast.type === "success" ? <Check size={17} /> : <X size={17} />}
          <span className="flex-1">{toast.message}</span>
          <button
            aria-label="Dismiss notification"
            className="rounded-md p-1 opacity-70 transition hover:bg-black/5 hover:opacity-100"
            onClick={() => setToast(null)}
            type="button"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </main>
  );
}

function StatCard({
  label,
  value,
  detail,
  icon,
  accent,
  id,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
  accent: "green" | "sand" | "blue";
  id?: string;
}) {
  const styles = {
    green: "bg-[#edf4ee] text-[#477756]",
    sand: "bg-[#f7f1e9] text-[#a4784b]",
    blue: "bg-[#edf1f5] text-[#64809b]",
  };
  return (
    <article id={id} className="rounded-2xl border border-[var(--line)] bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[#77827a]">{label}</p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${styles[accent]}`}>
          {icon}
        </span>
      </div>
      <p className="mt-4 truncate text-2xl font-semibold tracking-[-0.045em]">{value}</p>
      <p className="mt-1 text-[11px] text-[#9aa29c]">{detail}</p>
    </article>
  );
}

function FormField({
  label,
  name,
  type = "text",
  required = false,
  min,
  step,
  list,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  min?: string;
  step?: string;
  list?: string;
}) {
  return (
    <label className="block text-xs font-medium text-[#59665e]">
      {label}
      <input
        className="mt-1.5 w-full rounded-xl border border-[var(--line)] px-3 py-2.5 text-sm outline-none focus:border-[#a7c3ad]"
        list={list}
        min={min}
        name={name}
        required={required}
        step={step}
        type={type}
      />
    </label>
  );
}
