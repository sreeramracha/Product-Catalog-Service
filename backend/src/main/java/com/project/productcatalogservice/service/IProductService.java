package com.project.productcatalogservice.service;

import com.project.productcatalogservice.dto.ProductDto;
import com.project.productcatalogservice.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface IProductService {
    Product getProductById(Long id);

    Product createProduct(ProductDto productDto);

    Product replaceProduct(Long id, ProductDto productDto);

    Product patchProduct(Long id, ProductDto patch);

    boolean deleteProductById(Long id);

    List<Product> getAllProducts();

    Page<Product> getProductInPriceRange(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
}
