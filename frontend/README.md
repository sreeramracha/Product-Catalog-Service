# Product Catalog frontend

Next.js App Router UI styled with Tailwind CSS. The frontend calls the existing Spring API through a Next.js rewrite:

- `GET /products` loads catalog products.
- `GET /products/search` filters products by a minimum and maximum price.
- `POST /products` creates a product.
- `PATCH /products/{id}` updates a product.
- `DELETE /products/{id}` removes a product.
- `GET /products/{id}/pitch` generates a product pitch.
- `GET /categories/{category}` loads the average price for a category.

## Catalog features

- Search products, filter by category and price, and sort by name or price.
- Browse results with eight products per page.
- Save favorites in this browser; favorites are not synced between devices or to the backend.
- Open a product's details from its name or the view button.
- See loading skeletons, action notifications, and reduced-motion-aware transitions.
- Browse the catalog without signing in; product creation, editing, and deletion are available only to authenticated administrators.
- Sign in through the User Auth service. The frontend verifies the returned token's role before showing admin controls.

## Run locally

1. Start the User Auth service on port `8081` and ensure an account with the `ADMIN` role exists. Public signup creates `USER` accounts only.
2. Configure the catalog backend's required `DB_USERNAME`, `DB_PASSWORD`, and `GROQ_API_KEY` environment variables, then start Spring from `backend/`:

    ```powershell
    cd backend
    .\mvnw.cmd spring-boot:run
    ```

3. If either service is hosted somewhere other than `http://localhost:8080` or `http://localhost:8081`, set `BACKEND_URL` or `AUTH_SERVICE_URL` in the frontend environment.
4. Install dependencies and start the frontend from `frontend/`:

    ```powershell
    cd frontend
    npm install
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000).
