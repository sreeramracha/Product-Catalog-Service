"use client";

import { ArrowDownWideNarrow, X } from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { CatalogContent } from "./components/CatalogContent";
import { CatalogHeader } from "./components/CatalogHeader";
import { CatalogSidebar } from "./components/CatalogSidebar";
import { ProductDialogs } from "./components/ProductDialogs";
import { AUTH_TOKEN_STORAGE_KEY } from "./constants";
import { useCatalogView } from "./hooks/useCatalogView";
import { useFavorites } from "./hooks/useFavorites";
import { apiRequest } from "./lib/api-client";
import { formatPrice } from "./lib/format-price";
import type {
	AuthUser,
	Product,
	ProductPitch,
	SearchResults,
	Toast,
} from "./types";

export default function CatalogDashboard() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [query, setQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("All categories");
	const [minPrice, setMinPrice] = useState("");
	const [maxPrice, setMaxPrice] = useState("");
	const [appliedRange, setAppliedRange] = useState<{
		min: string;
		max: string;
	} | null>(null);
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [pitch, setPitch] = useState<ProductPitch | null>(null);
	const [pitchLoading, setPitchLoading] = useState<number | null>(null);
	const [average, setAverage] = useState<number | null>(null);
	const [averageLoading, setAverageLoading] = useState(false);
	const [sortOrder, setSortOrder] = useState("name-asc");
	const [currentPage, setCurrentPage] = useState(1);
	const [showFavorites, setShowFavorites] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(
		null,
	);
	const [toast, setToast] = useState<Toast | null>(null);
	const { favoriteIds, setFavoriteIds, toggleFavorite } =
		useFavorites(setToast);
	const [adminToken, setAdminToken] = useState("");
	const [adminUser, setAdminUser] = useState<AuthUser | null>(null);
	const [authChecking, setAuthChecking] = useState(true);
	const [isLoginOpen, setIsLoginOpen] = useState(false);
	const [isLoginLoading, setIsLoginLoading] = useState(false);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);

	const isAdmin = adminUser?.role === "ADMIN";
	const { categories, visibleProducts, pageCount, paginatedProducts } =
		useCatalogView({
			products,
			query,
			categoryFilter,
			showFavorites,
			favoriteIds,
			sortOrder,
			currentPage,
			setCurrentPage,
		});

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
		let ignored = false;
		const savedToken = window.sessionStorage.getItem(
			AUTH_TOKEN_STORAGE_KEY,
		);
		if (!savedToken) {
			setAuthChecking(false);
			return;
		}

		fetch("/auth-api/api/auth/validateToken", {
			headers: { Authorization: `Bearer ${savedToken}` },
		})
			.then(async (response) => {
				if (!response.ok) {
					throw new Error(
						"Saved admin session has expired. Please sign in again.",
					);
				}
				return (await response.json()) as AuthUser;
			})
			.then((user) => {
				if (ignored) return;
				if (user.role !== "ADMIN") {
					throw new Error(
						"This account does not have administrator access.",
					);
				}
				setAdminToken(savedToken);
				setAdminUser(user);
			})
			.catch((authError: unknown) => {
				window.sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
				if (!ignored && authError instanceof Error) {
					setToast({ message: authError.message, type: "error" });
				}
			})
			.finally(() => {
				if (!ignored) setAuthChecking(false);
			});

		return () => {
			ignored = true;
		};
	}, []);

	useEffect(() => {
		if (!toast) return;
		const timeoutId = window.setTimeout(() => setToast(null), 3500);
		return () => window.clearTimeout(timeoutId);
	}, [toast]);

	useEffect(() => {
		if (categoryFilter !== "All categories") {
			let ignored = false;
			setAverageLoading(true);
			setAverage(null);
			apiRequest<number | null>(
				`/categories/${encodeURIComponent(categoryFilter)}`,
			)
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
		if (
			!minPrice ||
			!maxPrice ||
			!Number.isFinite(min) ||
			!Number.isFinite(max) ||
			min > max
		) {
			setError(
				"Enter a valid minimum and maximum price, with the minimum no greater than the maximum.",
			);
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
			await apiRequest<Product>(
				"/products",
				{
					method: "POST",
					body: JSON.stringify(payload),
				},
				adminToken,
			);
			setIsCreateOpen(false);
			await loadProducts();
			setToast({
				message: "Product added to your catalog.",
				type: "success",
			});
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
		if (!window.confirm(`Remove "${product.name}" from the catalog?`))
			return;
		setError("");
		try {
			await apiRequest<void>(
				`/products/${product.id}`,
				{ method: "DELETE" },
				adminToken,
			);
			setProducts((current) =>
				current.filter((item) => item.id !== product.id),
			);
			setFavoriteIds((current) =>
				current.filter((id) => id !== product.id),
			);
			if (selectedProduct?.id === product.id) setSelectedProduct(null);
			setToast({
				message: "Product removed from your catalog.",
				type: "success",
			});
		} catch (requestError) {
			setError(
				requestError instanceof Error
					? requestError.message
					: "Could not remove the product.",
			);
		}
	}

	async function loginAsAdmin(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		setIsLoginLoading(true);
		setError("");
		try {
			const loginResponse = await fetch("/auth-api/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: String(formData.get("email") ?? "").trim(),
					password: String(formData.get("password") ?? ""),
				}),
			});
			if (!loginResponse.ok) {
				throw new Error(
					loginResponse.status === 401
						? "Email or password is incorrect."
						: "Could not sign in.",
				);
			}

			const loginResult = (await loginResponse.json()) as {
				token: string;
			};
			const validationResponse = await fetch(
				"/auth-api/api/auth/validateToken",
				{
					headers: { Authorization: `Bearer ${loginResult.token}` },
				},
			);
			if (!validationResponse.ok) {
				throw new Error(
					"Sign-in succeeded, but the account role could not be verified.",
				);
			}
			const user = (await validationResponse.json()) as AuthUser;
			if (user.role !== "ADMIN") {
				throw new Error(
					"This account does not have administrator access.",
				);
			}

			window.sessionStorage.setItem(
				AUTH_TOKEN_STORAGE_KEY,
				loginResult.token,
			);
			setAdminToken(loginResult.token);
			setAdminUser(user);
			setIsLoginOpen(false);
			setToast({
				message: `Signed in as admin: ${user.email}`,
				type: "success",
			});
		} catch (requestError) {
			setError(
				requestError instanceof Error
					? requestError.message
					: "Could not sign in.",
			);
		} finally {
			setIsLoginLoading(false);
		}
	}

	function logoutAdmin() {
		window.sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
		setAdminToken("");
		setAdminUser(null);
		setEditingProduct(null);
		setIsCreateOpen(false);
		setToast({ message: "Admin session signed out.", type: "success" });
	}

	async function updateProduct(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!editingProduct) return;
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
			await apiRequest<Product>(
				`/products/${editingProduct.id}`,
				{
					method: "PATCH",
					body: JSON.stringify(payload),
				},
				adminToken,
			);
			setEditingProduct(null);
			await loadProducts();
			setToast({ message: "Product updated.", type: "success" });
		} catch (requestError) {
			setError(
				requestError instanceof Error
					? requestError.message
					: "Could not update the product.",
			);
		} finally {
			setIsSaving(false);
		}
	}

	const averageLabel = averageLoading
		? "Loading…"
		: average === null
			? "No average available"
			: formatPrice(average);

	return (
		<main className="page-enter min-h-screen md:flex">
			<CatalogSidebar
				categories={categories}
				showFavorites={showFavorites}
				setShowFavorites={setShowFavorites}
				favoriteIds={favoriteIds}
				setCategoryFilter={setCategoryFilter}
				adminUser={adminUser}
				isAdmin={isAdmin}
			/>

			<section className="min-w-0 flex-1">
				<CatalogHeader
					isAdmin={isAdmin}
					authChecking={authChecking}
					logoutAdmin={logoutAdmin}
					setIsCreateOpen={setIsCreateOpen}
					setIsLoginOpen={setIsLoginOpen}
				/>

				<div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10">
					<div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
						<div>
							<p className="mb-2 text-xs font-semibold uppercase tracking-[0.13em] text-[var(--green)]">
								Monday, your catalog is looking good
							</p>
							<h2 className="text-3xl font-semibold tracking-[-0.055em] sm:text-[38px]">
								Product overview
								<span className="text-[#91ad98]">.</span>
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
							<button
								aria-label="Dismiss error"
								onClick={() => setError("")}
							>
								<X size={16} />
							</button>
						</div>
					)}

					<CatalogContent
						products={products}
						loading={loading}
						categories={categories}
						categoryFilter={categoryFilter}
						setCategoryFilter={setCategoryFilter}
						averageLabel={averageLabel}
						showFavorites={showFavorites}
						visibleProducts={visibleProducts}
						appliedRange={appliedRange}
						query={query}
						setQuery={setQuery}
						sortOrder={sortOrder}
						setSortOrder={setSortOrder}
						minPrice={minPrice}
						setMinPrice={setMinPrice}
						maxPrice={maxPrice}
						setMaxPrice={setMaxPrice}
						applyPriceRange={applyPriceRange}
						clearPriceRange={clearPriceRange}
						paginatedProducts={paginatedProducts}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						pageCount={pageCount}
						favoriteIds={favoriteIds}
						toggleFavorite={toggleFavorite}
						setSelectedProduct={setSelectedProduct}
						isAdmin={isAdmin}
						setEditingProduct={setEditingProduct}
						pitchLoading={pitchLoading}
						generatePitch={generatePitch}
						deleteProduct={deleteProduct}
					/>
				</div>
			</section>

			<ProductDialogs
				isCreateOpen={isCreateOpen}
				setIsCreateOpen={setIsCreateOpen}
				categories={categories}
				isSaving={isSaving}
				createProduct={createProduct}
				isLoginOpen={isLoginOpen}
				setIsLoginOpen={setIsLoginOpen}
				isLoginLoading={isLoginLoading}
				loginAsAdmin={loginAsAdmin}
				editingProduct={editingProduct}
				setEditingProduct={setEditingProduct}
				updateProduct={updateProduct}
				pitch={pitch}
				setPitch={setPitch}
				selectedProduct={selectedProduct}
				setSelectedProduct={setSelectedProduct}
				favoriteIds={favoriteIds}
				toggleFavorite={toggleFavorite}
				toast={toast}
				setToast={setToast}
			/>
		</main>
	);
}
