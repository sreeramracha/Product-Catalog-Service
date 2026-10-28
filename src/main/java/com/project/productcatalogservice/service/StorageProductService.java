package com.project.productcatalogservice.service;

import com.project.productcatalogservice.dto.ProductDto;
import com.project.productcatalogservice.model.Category;
import com.project.productcatalogservice.model.Product;
import com.project.productcatalogservice.model.enums.State;
import com.project.productcatalogservice.repository.CategoryRepository;
import com.project.productcatalogservice.repository.ProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Primary
@Service
@Slf4j
public class StorageProductService implements IProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public StorageProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public Product getProductById(Long id) {
//        Optional<Product> productOptional = productRepository.findById(id);
//        if (productOptional.isEmpty()) {
//            return null;
//        }
//        return productOptional.get();
        log.info("Get product from DB: " + id);
        return productRepository.findByIdAndState(id, State.ACTIVE).orElse(null);
    }

    @Override
    public Product createProduct(ProductDto productDto) {
        Product product = from(productDto);
        product.setCategory(findOrCreateCtegory(product.getCategory()));
        product.setUpdatedAt(new Date());
        product.setCreatedAt(new Date());
        product.setState(State.ACTIVE);

        return productRepository.save(product);
    }

    @Override
    public boolean deleteProductById(Long id) {
        Product product = productRepository.findById(id).orElse(null);
        if (product == null) {
            return false;
        }
        product.setState(State.INACTIVE);
        product.setUpdatedAt(new Date());
        productRepository.save(product);
        return true;
    }

    private Category findOrCreateCtegory(Category category) {
        if (category == null) {
            return null;
        }

        Optional<Category> existing = categoryRepository.findByName(category.getName());
        if (existing.isPresent()) {
            return existing.get();
        }

        Date now = new Date();
        category.setId(null);
        category.setUpdatedAt(now);
        category.setCreatedAt(now);

        return category;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    private Product from(ProductDto dto) {
        Product product = new Product();

        product.setId(dto.getId());
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setImageUrl(dto.getImageUrl());

        if (dto.getCategory() != null) {
            Category category = new Category();
            category.setName(dto.getCategory().getName());
            category.setDescription(dto.getCategory().getDescription());
            product.setCategory(category);
        }

        return product;
    }
}
