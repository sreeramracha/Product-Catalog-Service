package com.project.productcatalogservice.service;

import com.project.productcatalogservice.dto.ProductDto;
import com.project.productcatalogservice.mapper.ProductMapper;
import com.project.productcatalogservice.model.Category;
import com.project.productcatalogservice.model.Product;
import com.project.productcatalogservice.model.enums.State;
import com.project.productcatalogservice.repository.CategoryRepository;
import com.project.productcatalogservice.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Primary
@Service
@Slf4j
@RequiredArgsConstructor
public class StorageProductService implements IProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;
//    private int maxCount; // @AllArgsConstructor -> will create for this as well but we need to create for final variables

//    public StorageProductService(ProductRepository productRepository, CategoryRepository categoryRepository, ProductMapper productMapper) {
//        this.productRepository = productRepository;
//        this.categoryRepository = categoryRepository;
//        this.productMapper = productMapper;
//    }

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

        Product product = productMapper.toEntity(productDto);
        product.setCategory(findOrCreateCtegory(product.getCategory()));
        product.setUpdatedAt(new Date());
        product.setCreatedAt(new Date());
        product.setState(State.ACTIVE);

        return productRepository.save(product);
    }

    @Override
    public Product replaceProduct(Long id, ProductDto productDto) {
        Product product = getProductById(id);
        if (product == null) {
            return null;
        }

        Product replacement = productMapper.toEntity(productDto);
        product.setName(replacement.getName());
        product.setDescription(replacement.getDescription());
        product.setPrice(replacement.getPrice());
        product.setImageUrl(replacement.getImageUrl());
        product.setCategory(replacement.getCategory());
        product.setCategory(findOrCreateCtegory(product.getCategory()));
        product.setUpdatedAt(new Date());
        return productRepository.save(product);
    }

    @Override
    public Product patchProduct(Long id, ProductDto patch) {
        Product product = getProductById(id);
        if (product == null) {
            return null;
        }

        Product updates = productMapper.toEntity(patch);
        if (patch.getName() != null) {
            product.setName(updates.getName());
        }
        if (patch.getDescription() != null) {
            product.setDescription(updates.getDescription());
        }
        if (patch.getPrice() != null) {
            product.setPrice(updates.getPrice());
        }
        if (patch.getImageUrl() != null) {
            product.setImageUrl(updates.getImageUrl());
        }
        if (patch.getCategory() != null) {
            Category updatedCategory = updates.getCategory();
            Category existingCategory = product.getCategory();
            if (existingCategory == null) {
                product.setCategory(findOrCreateCtegory(updatedCategory));
            } else {
                if (patch.getCategory().getName() != null) {
                    existingCategory.setName(updatedCategory.getName());
                }
                if (patch.getCategory().getDescription() != null) {
                    existingCategory.setDescription(updatedCategory.getDescription());
                }
                product.setCategory(findOrCreateCtegory(existingCategory));
            }
        }
        product.setUpdatedAt(new Date());
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

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAllProducts();
    }

    @Override
    public Page<Product> getProductInPriceRange(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        return productRepository.findByPriceBetweenAndState(minPrice, maxPrice, State.ACTIVE, pageable);
    }

}
