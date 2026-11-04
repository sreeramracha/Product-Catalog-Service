export type Category = {
	name: string;
	description?: string | null;
};

export type Product = {
	id: number;
	name: string;
	price: number;
	description?: string | null;
	category?: Category | null;
	imageUrl?: string | null;
};

export type SearchResults = {
	content: Product[];
};

export type Toast = {
	message: string;
	type: "success" | "error";
};

export type ProductPitch = {
	name: string;
	text: string;
};

export type AuthUser = {
	email: string;
	role: string;
};
