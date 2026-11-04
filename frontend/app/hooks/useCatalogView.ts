"use client";

import { useEffect, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { PAGE_SIZE } from "../constants";
import type { Product } from "../types";

type CatalogViewOptions = {
	products: Product[];
	query: string;
	categoryFilter: string;
	showFavorites: boolean;
	favoriteIds: number[];
	sortOrder: string;
	currentPage: number;
	setCurrentPage: Dispatch<SetStateAction<number>>;
};

export function useCatalogView({
	products,
	query,
	categoryFilter,
	showFavorites,
	favoriteIds,
	sortOrder,
	currentPage,
	setCurrentPage,
}: CatalogViewOptions) {
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
			const matchesFavorites =
				!showFavorites || favoriteIds.includes(product.id);
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
	}, [
		categoryFilter,
		favoriteIds,
		products,
		query,
		showFavorites,
		sortOrder,
	]);

	const pageCount = Math.max(
		1,
		Math.ceil(visibleProducts.length / PAGE_SIZE),
	);
	const paginatedProducts = visibleProducts.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE,
	);

	useEffect(() => {
		setCurrentPage(1);
	}, [categoryFilter, query, setCurrentPage, showFavorites, sortOrder]);

	useEffect(() => {
		setCurrentPage((page) => Math.min(page, pageCount));
	}, [pageCount, setCurrentPage]);

	return { categories, visibleProducts, pageCount, paginatedProducts };
}
