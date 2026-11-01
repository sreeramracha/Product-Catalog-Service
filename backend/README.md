# Product Catalog Service backend

This directory contains the Spring Boot REST API for the Product Catalog Service. It uses Java 17, Maven, Spring Data JPA, and MySQL.

For an overview of the full project, see the [root README](../README.md). For frontend setup and API integration details, see the [frontend README](../frontend/README.md).

## Requirements

- Java 17 or later
- MySQL
- A Groq API key for generating product pitches

Create a MySQL database named `productcatalogservice`, then set the following environment variables before starting the application:

| Variable | Purpose |
| --- | --- |
| `DB_USERNAME` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `GROQ_API_KEY` | API key used to generate product pitches |

The application connects to MySQL at `jdbc:mysql://localhost:3306/productcatalogservice`.

## Run locally

From this directory, run the Spring Boot application with the Maven wrapper:

```powershell
.\mvnw.cmd spring-boot:run
```

The API is available at `http://localhost:8080`.

## API endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/products` | List products |
| `GET` | `/products/{id}` | Get a product |
| `GET` | `/products/search` | Search products by a price range |
| `POST` | `/products` | Create a product |
| `DELETE` | `/products/{id}` | Delete a product |
| `GET` | `/products/{id}/pitch` | Generate a product pitch |
| `GET` | `/categories/{category}` | Get the average price for a category |
| `POST` | `/internal/products/import` | Import products |

## Run tests

```powershell
.\mvnw.cmd test
```
