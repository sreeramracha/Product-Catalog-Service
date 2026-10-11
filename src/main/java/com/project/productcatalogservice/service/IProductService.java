package com.project.productcatalogservice.service;

import com.project.productcatalogservice.model.Product;

public interface IProductService {
    Product getProductById(Long id);
}
