"use client";

import { useCallback, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { FAVORITES_STORAGE_KEY } from "../constants";
import type { Product, Toast } from "../types";

export function useFavorites(
	setToast: Dispatch<SetStateAction<Toast | null>>,
) {
	const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
	const [favoritesReady, setFavoritesReady] = useState(false);

	useEffect(() => {
		try {
			const savedFavorites = window.localStorage.getItem(
				FAVORITES_STORAGE_KEY,
			);
			if (savedFavorites) {
				const parsedFavorites: unknown = JSON.parse(savedFavorites);
				if (
					Array.isArray(parsedFavorites) &&
					parsedFavorites.every(
						(id) => typeof id === "number" && Number.isFinite(id),
					)
				) {
					setFavoriteIds(parsedFavorites);
				}
			}
		} catch {
			setToast({
				message: "Could not load saved favorites from this browser.",
				type: "error",
			});
		} finally {
			setFavoritesReady(true);
		}
	}, [setToast]);

	useEffect(() => {
		if (!favoritesReady) return;
		try {
			window.localStorage.setItem(
				FAVORITES_STORAGE_KEY,
				JSON.stringify(favoriteIds),
			);
		} catch {
			setToast({
				message: "Could not save favorites in this browser.",
				type: "error",
			});
		}
	}, [favoriteIds, favoritesReady, setToast]);

	const toggleFavorite = useCallback(
		(product: Product) => {
			const isFavorite = favoriteIds.includes(product.id);
			setFavoriteIds((current) =>
				isFavorite
					? current.filter((id) => id !== product.id)
					: [...current, product.id],
			);
			setToast({
				message: isFavorite
					? `${product.name} removed from favorites.`
					: `${product.name} added to favorites.`,
				type: "success",
			});
		},
		[favoriteIds, setToast],
	);

	return { favoriteIds, setFavoriteIds, toggleFavorite };
}
