import {
	ArrowRight,
	ArrowUpRight,
	BadgePercent,
	Boxes,
	Check,
	ChevronLeft,
	ChevronRight,
	Eye,
	Heart,
	LoaderCircle,
	Pencil,
	Search,
	Sparkles,
	Tag,
	Trash2,
	X,
} from "lucide-react";
import type { Dispatch, FormEventHandler, SetStateAction } from "react";
import { PAGE_SIZE } from "../constants";
import { StatCard } from "./StatCard";
import { formatPrice } from "../lib/format-price";
import type { Product } from "../types";

type Props = {
	products: Product[];
	loading: boolean;
	categories: string[];
	categoryFilter: string;
	setCategoryFilter: Dispatch<SetStateAction<string>>;
	averageLabel: string;
	showFavorites: boolean;
	visibleProducts: Product[];
	appliedRange: { min: string; max: string } | null;
	query: string;
	setQuery: Dispatch<SetStateAction<string>>;
	sortOrder: string;
	setSortOrder: Dispatch<SetStateAction<string>>;
	minPrice: string;
	setMinPrice: Dispatch<SetStateAction<string>>;
	maxPrice: string;
	setMaxPrice: Dispatch<SetStateAction<string>>;
	applyPriceRange: FormEventHandler<HTMLFormElement>;
	clearPriceRange: () => void;
	paginatedProducts: Product[];
	currentPage: number;
	setCurrentPage: Dispatch<SetStateAction<number>>;
	pageCount: number;
	favoriteIds: number[];
	toggleFavorite: (product: Product) => void;
	setSelectedProduct: Dispatch<SetStateAction<Product | null>>;
	isAdmin: boolean;
	setEditingProduct: Dispatch<SetStateAction<Product | null>>;
	pitchLoading: number | null;
	generatePitch: (product: Product) => void | Promise<void>;
	deleteProduct: (product: Product) => void | Promise<void>;
};

export function CatalogContent({
	products,
	loading,
	categories,
	categoryFilter,
	setCategoryFilter,
	averageLabel,
	showFavorites,
	visibleProducts,
	appliedRange,
	query,
	setQuery,
	sortOrder,
	setSortOrder,
	minPrice,
	setMinPrice,
	maxPrice,
	setMaxPrice,
	applyPriceRange,
	clearPriceRange,
	paginatedProducts,
	currentPage,
	setCurrentPage,
	pageCount,
	favoriteIds,
	toggleFavorite,
	setSelectedProduct,
	isAdmin,
	setEditingProduct,
	pitchLoading,
	generatePitch,
	deleteProduct,
}: Props) {
	return (
		<>
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
					label={
						categoryFilter === "All categories"
							? "Category average"
							: `${categoryFilter} average`
					}
					value={
						categoryFilter === "All categories"
							? "Choose a category"
							: averageLabel
					}
					detail="Live from your catalog"
					icon={<BadgePercent size={18} />}
					accent="blue"
					id="insights"
				/>
			</div>

			<section
				id="catalog"
				className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white"
			>
				<div className="flex flex-col gap-4 border-b border-[var(--line)] px-5 py-5 sm:px-6">
					<div className="flex flex-wrap items-center justify-between gap-3">
						<div>
							<h3 className="text-base font-semibold tracking-[-0.025em]">
								{showFavorites
									? "Favorite products"
									: "Your products"}
							</h3>
							<p className="mt-1 text-xs text-[#88918b]">
								{visibleProducts.length}{" "}
								{visibleProducts.length === 1
									? "item"
									: "items"}{" "}
								in view
								{appliedRange &&
									" · price range applied"}
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
								onChange={(event) =>
									setQuery(event.target.value)
								}
								placeholder="Search products..."
								value={query}
							/>
						</label>
						<select
							aria-label="Filter by category"
							className="rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-xs text-[#59665e] outline-none focus:border-[#a7c3ad]"
							onChange={(event) =>
								setCategoryFilter(event.target.value)
							}
							value={categoryFilter}
						>
							<option>All categories</option>
							{categories.map((category) => (
								<option key={category}>
									{category}
								</option>
							))}
						</select>
						<select
							aria-label="Sort products"
							className="rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-xs text-[#59665e] outline-none focus:border-[#a7c3ad]"
							onChange={(event) =>
								setSortOrder(event.target.value)
							}
							value={sortOrder}
						>
							<option value="name-asc">
								Name: A to Z
							</option>
							<option value="name-desc">
								Name: Z to A
							</option>
							<option value="price-asc">
								Price: low to high
							</option>
							<option value="price-desc">
								Price: high to low
							</option>
						</select>
						<form
							onSubmit={applyPriceRange}
							className="flex items-center gap-2"
						>
							<input
								aria-label="Minimum price"
								className="w-[100px] rounded-xl border border-[var(--line)] px-3 py-2.5 text-xs outline-none focus:border-[#a7c3ad]"
								min="0"
								onChange={(event) =>
									setMinPrice(event.target.value)
								}
								placeholder="Min $"
								step="0.01"
								type="number"
								value={minPrice}
							/>
							<span className="text-xs text-[#a1aaa3]">
								to
							</span>
							<input
								aria-label="Maximum price"
								className="w-[100px] rounded-xl border border-[var(--line)] px-3 py-2.5 text-xs outline-none focus:border-[#a7c3ad]"
								min="0"
								onChange={(event) =>
									setMaxPrice(event.target.value)
								}
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
								<th className="px-6 py-3.5 font-semibold">
									Product
								</th>
								<th className="px-4 py-3.5 font-semibold">
									Category
								</th>
								<th className="px-4 py-3.5 font-semibold">
									Price
								</th>
								<th className="px-4 py-3.5 font-semibold">
									Description
								</th>
								<th className="px-6 py-3.5 text-right font-semibold">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								Array.from(
									{ length: 5 },
									(_, index) => (
										<tr
											className="border-b border-[#f0f1ed] last:border-0"
											key={index}
										>
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<span className="skeleton h-11 w-11 rounded-xl" />
													<span className="space-y-2">
														<span className="skeleton block h-3 w-32 rounded" />
														<span className="skeleton block h-2.5 w-20 rounded" />
													</span>
												</div>
											</td>
											<td className="px-4 py-4">
												<span className="skeleton block h-5 w-20 rounded-full" />
											</td>
											<td className="px-4 py-4">
												<span className="skeleton block h-3 w-14 rounded" />
											</td>
											<td className="px-4 py-4">
												<span className="skeleton block h-3 w-36 rounded" />
											</td>
											<td className="px-6 py-4">
												<span className="skeleton ml-auto block h-7 w-16 rounded-lg" />
											</td>
										</tr>
									),
								)
							) : visibleProducts.length === 0 ? (
								<tr>
									<td
										className="px-6 py-16 text-center"
										colSpan={5}
									>
										<div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2f5f1] text-[var(--green)]">
											<Boxes size={19} />
										</div>
										<p className="mt-3 text-sm font-semibold">
											Nothing here yet
										</p>
										<p className="mt-1 text-xs text-[#8b958e]">
											Try another search or add
											your first product.
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
															src={
																product.imageUrl
															}
														/>
													) : (
														<Tag
															size={17}
														/>
													)}
												</div>
												<div className="min-w-0">
													<button
														className="max-w-full truncate text-left text-xs font-semibold text-[#29352e] hover:text-[var(--green)]"
														onClick={() =>
															setSelectedProduct(
																product,
															)
														}
														type="button"
													>
														{product.name}
													</button>
													<p className="mt-1 text-[10px] text-[#a0a8a2]">
														Product #
														{product.id}
													</p>
												</div>
											</div>
										</td>
										<td className="px-4 py-4">
											{product.category?.name ? (
												<span className="rounded-full bg-[#f3f5f1] px-2.5 py-1 text-[10px] font-medium text-[#647168]">
													{
														product.category
															.name
													}
												</span>
											) : (
												<span className="text-xs text-[#a0a8a2]">
													Uncategorized
												</span>
											)}
										</td>
										<td className="px-4 py-4 text-xs font-semibold text-[#39463e]">
											{formatPrice(product.price)}
										</td>
										<td className="max-w-[240px] px-4 py-4">
											<p className="truncate text-xs text-[#838d86]">
												{product.description ||
													"—"}
											</p>
										</td>
										<td className="px-6 py-4">
											<div className="flex justify-end gap-1">
												<button
													aria-label={`${favoriteIds.includes(product.id) ? "Remove" : "Add"} ${product.name} ${favoriteIds.includes(product.id) ? "from" : "to"} favorites`}
													aria-pressed={favoriteIds.includes(
														product.id,
													)}
													className={`rounded-lg p-2 ${
														favoriteIds.includes(
															product.id,
														)
															? "text-[#bd5942] hover:bg-[#fff1ed]"
															: "text-[#a0a8a2] hover:bg-[#fff1ed] hover:text-[#bd5942]"
													}`}
													onClick={() =>
														toggleFavorite(
															product,
														)
													}
													title={
														favoriteIds.includes(
															product.id,
														)
															? "Remove from favorites"
															: "Add to favorites"
													}
													type="button"
												>
													<Heart
														fill={
															favoriteIds.includes(
																product.id,
															)
																? "currentColor"
																: "none"
														}
														size={15}
													/>
												</button>
												<button
													aria-label={`View ${product.name} details`}
													className="rounded-lg p-2 text-[#819087] hover:bg-[#edf4ee] hover:text-[var(--green)]"
													onClick={() =>
														setSelectedProduct(
															product,
														)
													}
													title="View product details"
													type="button"
												>
													<Eye size={15} />
												</button>
												{isAdmin && (
													<button
														aria-label={`Edit ${product.name}`}
														className="rounded-lg p-2 text-[#819087] hover:bg-[#edf4ee] hover:text-[var(--green)]"
														onClick={() =>
															setEditingProduct(
																product,
															)
														}
														title="Edit product"
														type="button"
													>
														<Pencil
															size={15}
														/>
													</button>
												)}
												<button
													aria-label={`Generate pitch for ${product.name}`}
													className="rounded-lg p-2 text-[#819087] hover:bg-[#edf4ee] hover:text-[var(--green)]"
													disabled={
														pitchLoading ===
														product.id
													}
													onClick={() =>
														void generatePitch(
															product,
														)
													}
													title="Generate product pitch"
												>
													{pitchLoading ===
													product.id ? (
														<LoaderCircle
															className="animate-spin"
															size={15}
														/>
													) : (
														<Sparkles
															size={15}
														/>
													)}
												</button>
												{isAdmin && (
													<button
														aria-label={`Delete ${product.name}`}
														className="rounded-lg p-2 text-[#a0a8a2] hover:bg-[#fff1ed] hover:text-[#bd5942]"
														onClick={() =>
															void deleteProduct(
																product,
															)
														}
														title="Remove product"
													>
														<Trash2
															size={15}
														/>
													</button>
												)}
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
						Showing{" "}
						{visibleProducts.length === 0
							? 0
							: (currentPage - 1) * PAGE_SIZE + 1}
						–
						{Math.min(
							currentPage * PAGE_SIZE,
							visibleProducts.length,
						)}{" "}
						of {visibleProducts.length}
					</span>
					<div
						aria-label="Product pages"
						className="flex items-center gap-2"
					>
						<button
							aria-label="Previous page"
							className="rounded-lg border border-[var(--line)] p-1.5 text-[#647168] transition hover:bg-[#f5f7f3] disabled:cursor-not-allowed disabled:opacity-40"
							disabled={currentPage === 1}
							onClick={() =>
								setCurrentPage((page) =>
									Math.max(1, page - 1),
								)
							}
							type="button"
						>
							<ChevronLeft size={15} />
						</button>
						<span>
							Page {currentPage} of {pageCount}
						</span>
						<button
							aria-label="Next page"
							className="rounded-lg border border-[var(--line)] p-1.5 text-[#647168] transition hover:bg-[#f5f7f3] disabled:cursor-not-allowed disabled:opacity-40"
							disabled={currentPage === pageCount}
							onClick={() =>
								setCurrentPage((page) =>
									Math.min(pageCount, page + 1),
								)
							}
							type="button"
						>
							<ChevronRight size={15} />
						</button>
					</div>
					<span className="flex items-center gap-1.5">
						<Check
							size={13}
							className="text-[var(--green)]"
						/>
						Changes sync with your backend
					</span>
				</div>
			</section>

			<footer className="flex flex-col justify-between gap-2 py-6 text-[10px] text-[#a0a8a2] sm:flex-row">
				<span>
					Made for people who care about the little details.
				</span>
				<span className="flex items-center gap-1.5">
					View API-backed catalog <ArrowUpRight size={12} />
				</span>
			</footer>
		</>
	);
}
