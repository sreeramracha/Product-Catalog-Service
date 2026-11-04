import {
	Check,
	Heart,
	LoaderCircle,
	ShieldCheck,
	Sparkles,
	Tag,
	X,
} from "lucide-react";
import type { Dispatch, FormEventHandler, SetStateAction } from "react";
import { formatPrice } from "../lib/format-price";
import { FormField } from "./FormField";
import type { Product, ProductPitch, Toast } from "../types";

type Props = {
	isCreateOpen: boolean;
	setIsCreateOpen: Dispatch<SetStateAction<boolean>>;
	categories: string[];
	isSaving: boolean;
	createProduct: FormEventHandler<HTMLFormElement>;
	isLoginOpen: boolean;
	setIsLoginOpen: Dispatch<SetStateAction<boolean>>;
	isLoginLoading: boolean;
	loginAsAdmin: FormEventHandler<HTMLFormElement>;
	editingProduct: Product | null;
	setEditingProduct: Dispatch<SetStateAction<Product | null>>;
	updateProduct: FormEventHandler<HTMLFormElement>;
	pitch: ProductPitch | null;
	setPitch: Dispatch<SetStateAction<ProductPitch | null>>;
	selectedProduct: Product | null;
	setSelectedProduct: Dispatch<SetStateAction<Product | null>>;
	favoriteIds: number[];
	toggleFavorite: (product: Product) => void;
	toast: Toast | null;
	setToast: Dispatch<SetStateAction<Toast | null>>;
};

export function ProductDialogs({
	isCreateOpen,
	setIsCreateOpen,
	categories,
	isSaving,
	createProduct,
	isLoginOpen,
	setIsLoginOpen,
	isLoginLoading,
	loginAsAdmin,
	editingProduct,
	setEditingProduct,
	updateProduct,
	pitch,
	setPitch,
	selectedProduct,
	setSelectedProduct,
	favoriteIds,
	toggleFavorite,
	toast,
	setToast,
}: Props) {
	return (

		<>
			{isCreateOpen && (
				<div
					className="fixed inset-0 z-20 flex items-center justify-center bg-[#16231d]/35 p-4"
					onMouseDown={(event) => {
						if (event.target === event.currentTarget)
							setIsCreateOpen(false);
					}}
				>
					<div className="modal-enter w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
						<div className="mb-5 flex items-start justify-between">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--green)]">
									Catalog
								</p>
								<h3 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
									Add a product
								</h3>
							</div>
							<button
								aria-label="Close form"
								className="rounded-lg p-2 text-[#859087] hover:bg-[#f3f5f1]"
								onClick={() => setIsCreateOpen(false)}
							>
								<X size={17} />
							</button>
						</div>
						<form
							className="space-y-4"
							onSubmit={(event) => void createProduct(event)}
						>
							<FormField
								label="Product name"
								name="name"
								required
							/>
							<div className="grid gap-4 sm:grid-cols-2">
								<FormField
									label="Price (USD)"
									name="price"
									min="0"
									step="0.01"
									type="number"
									required
								/>
								<FormField
									label="Category"
									name="category"
									list="category-options"
								/>
								<datalist id="category-options">
									{categories.map((category) => (
										<option
											key={category}
											value={category}
										/>
									))}
								</datalist>
								<FormField
									label="Image URL"
									name="imageUrl"
									type="url"
								/>
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
									{isSaving && (
										<LoaderCircle
											className="animate-spin"
											size={14}
										/>
									)}
									Add product
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{isLoginOpen && (
				<div className="fixed inset-0 z-30 flex items-center justify-center bg-[#16231d]/40 p-4">
					<section
						aria-labelledby="admin-login-title"
						aria-modal="true"
						className="modal-enter w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
						role="dialog"
					>
						<div className="mb-5 flex items-start justify-between">
							<div>
								<p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.13em] text-[var(--green)]">
									<ShieldCheck size={15} /> Admin access
								</p>
								<h3
									className="mt-2 text-xl font-semibold tracking-[-0.04em]"
									id="admin-login-title"
								>
									Sign in to manage products
								</h3>
							</div>
							<button
								aria-label="Close sign in"
								className="rounded-lg p-2 text-[#859087] hover:bg-[#f3f5f1]"
								onClick={() => setIsLoginOpen(false)}
								type="button"
							>
								<X size={17} />
							</button>
						</div>
						<form
							className="space-y-4"
							onSubmit={(event) => void loginAsAdmin(event)}
						>
							<FormField
								label="Email"
								name="email"
								type="email"
								required
							/>
							<FormField
								label="Password"
								name="password"
								type="password"
								required
							/>
							<p className="text-xs leading-5 text-[#77817b]">
								Use an administrator account from the User Auth
								service. Product browsing does not require
								signing in.
							</p>
							<div className="flex justify-end gap-2 border-t border-[var(--line)] pt-4">
								<button
									className="rounded-xl px-4 py-2.5 text-xs font-semibold text-[#647168] hover:bg-[#f4f6f2]"
									onClick={() => setIsLoginOpen(false)}
									type="button"
								>
									Cancel
								</button>
								<button
									className="flex items-center gap-2 rounded-xl bg-[var(--green)] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[var(--green-dark)] disabled:opacity-60"
									disabled={isLoginLoading}
									type="submit"
								>
									{isLoginLoading && (
										<LoaderCircle
											className="animate-spin"
											size={14}
										/>
									)}{" "}
									Sign in
								</button>
							</div>
						</form>
					</section>
				</div>
			)}

			{editingProduct && (
				<div className="fixed inset-0 z-20 flex items-center justify-center bg-[#16231d]/35 p-4">
					<div className="modal-enter w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
						<div className="mb-5 flex items-start justify-between">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--green)]">
									Admin
								</p>
								<h3 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
									Edit product
								</h3>
							</div>
							<button
								aria-label="Close edit form"
								className="rounded-lg p-2 text-[#859087] hover:bg-[#f3f5f1]"
								onClick={() => setEditingProduct(null)}
								type="button"
							>
								<X size={17} />
							</button>
						</div>
						<form
							className="space-y-4"
							onSubmit={(event) => void updateProduct(event)}
						>
							<FormField
								defaultValue={editingProduct.name}
								label="Product name"
								name="name"
								required
							/>
							<div className="grid gap-4 sm:grid-cols-2">
								<FormField
									defaultValue={editingProduct.price}
									label="Price (USD)"
									name="price"
									min="0"
									step="0.01"
									type="number"
									required
								/>
								<FormField
									defaultValue={
										editingProduct.category?.name ?? ""
									}
									label="Category"
									name="category"
									list="edit-category-options"
								/>
								<datalist id="edit-category-options">
									{categories.map((category) => (
										<option
											key={category}
											value={category}
										/>
									))}
								</datalist>
								<FormField
									defaultValue={editingProduct.imageUrl ?? ""}
									label="Image URL"
									name="imageUrl"
									type="url"
								/>
							</div>
							<label className="block text-xs font-medium text-[#59665e]">
								Description
								<textarea
									className="mt-1.5 min-h-24 w-full resize-y rounded-xl border border-[var(--line)] px-3 py-2.5 text-sm outline-none focus:border-[#a7c3ad]"
									defaultValue={
										editingProduct.description ?? ""
									}
									name="description"
									rows={3}
								/>
							</label>
							<div className="flex justify-end gap-2 border-t border-[var(--line)] pt-4">
								<button
									className="rounded-xl px-4 py-2.5 text-xs font-semibold text-[#647168] hover:bg-[#f4f6f2]"
									onClick={() => setEditingProduct(null)}
									type="button"
								>
									Cancel
								</button>
								<button
									className="flex items-center gap-2 rounded-xl bg-[var(--green)] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[var(--green-dark)] disabled:opacity-60"
									disabled={isSaving}
									type="submit"
								>
									{isSaving && (
										<LoaderCircle
											className="animate-spin"
											size={14}
										/>
									)}{" "}
									Save changes
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
								<span className="text-xs font-semibold uppercase tracking-[0.12em]">
									Product pitch
								</span>
							</div>
							<button
								aria-label="Close product pitch"
								className="rounded-lg p-2 text-[#859087] hover:bg-[#f3f5f1]"
								onClick={() => setPitch(null)}
							>
								<X size={17} />
							</button>
						</div>
						<h3
							className="text-xl font-semibold tracking-[-0.04em]"
							id="pitch-title"
						>
							{pitch.name}
						</h3>
						<p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#69756d]">
							{pitch.text}
						</p>
					</section>
				</div>
			)}

			{selectedProduct && (
				<div
					className="fixed inset-0 z-30 flex items-center justify-center bg-[#16231d]/40 p-4 backdrop-blur-[2px]"
					onMouseDown={(event) => {
						if (event.target === event.currentTarget)
							setSelectedProduct(null);
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
										{selectedProduct.category?.name ||
											"Uncategorized"}{" "}
										· Product #{selectedProduct.id}
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
								{selectedProduct.description ||
									"No description has been added for this product."}
							</p>
							<div className="mt-6 flex justify-end border-t border-[var(--line)] pt-4">
								<button
									className="flex items-center gap-2 rounded-xl border border-[var(--line)] px-4 py-2.5 text-xs font-semibold text-[#59665e] transition hover:bg-[#f5f7f3]"
									onClick={() =>
										toggleFavorite(selectedProduct)
									}
									type="button"
								>
									<Heart
										fill={
											favoriteIds.includes(
												selectedProduct.id,
											)
												? "currentColor"
												: "none"
										}
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
					{toast.type === "success" ? (
						<Check size={17} />
					) : (
						<X size={17} />
					)}
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
		</>
	);
}
