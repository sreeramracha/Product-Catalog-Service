# Product Catalog frontend

Next.js App Router UI styled with Tailwind CSS. The frontend calls the existing Spring API through a Next.js rewrite:

- `GET /products` loads catalog products.
- `GET /products/search` filters products by a minimum and maximum price.
- `POST /products` creates a product.
- `DELETE /products/{id}` removes a product.
- `GET /products/{id}/pitch` generates a product pitch.
- `GET /categories/{category}` loads the average price for a category.

## Catalog features

- Search products, filter by category and price, and sort by name or price.
- Browse results with eight products per page.
- Save favorites in this browser; favorites are not synced between devices or to the backend.
- Open a product's details from its name or the view button.
- See loading skeletons, action notifications, and reduced-motion-aware transitions.

## Run locally

1. Configure the backend's required `DB_USERNAME`, `DB_PASSWORD`, and `GROQ_API_KEY` environment variables, then start Spring from `backend/`:

   ```powershell
   cd backend
   .\mvnw.cmd spring-boot:run
   ```

2. Copy `.env.example` to `.env.local` if the backend is hosted somewhere other than `http://localhost:8080`, and set `BACKEND_URL`.
3. Install dependencies and start the frontend from `frontend/`:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).
