package com.project.productcatalogservice.service;

import com.project.productcatalogservice.dto.ProductDto;
import com.project.productcatalogservice.model.Product;

public interface IProductService {
    Product getProductById(Long id);

    Product createProduct(ProductDto productDto);

    boolean deleteProductById(Long id);
}
