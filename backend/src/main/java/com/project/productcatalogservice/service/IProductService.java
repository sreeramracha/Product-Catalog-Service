package com.project.productcatalogservice.service;

import com.project.productcatalogservice.dto.ProductDto;
import com.project.productcatalogservice.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface IProductService {
    Product getProductById(UUID id);

    Product createProduct(ProductDto productDto);

    Product replaceProduct(UUID id, ProductDto productDto);

    Product patchProduct(UUID id, ProductDto patch);

    boolean deleteProductById(UUID id);

    List<Product> getAllProducts();

    Page<Product> getProductInPriceRange(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
}
