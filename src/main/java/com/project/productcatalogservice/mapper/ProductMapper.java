package com.project.productcatalogservice.mapper;

import com.project.productcatalogservice.dto.CategoryDto;
import com.project.productcatalogservice.dto.ProductDto;
import com.project.productcatalogservice.model.Category;
import com.project.productcatalogservice.model.Product;
import com.project.productcatalogservice.model.enums.State;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public ProductDto toDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setImageUrl(product.getImageUrl());

        if (product.getCategory() != null) {
            CategoryDto categoryDto = new CategoryDto();
            categoryDto.setName(product.getCategory().getName());
            categoryDto.setDescription(product.getCategory().getDescription());
            dto.setCategory(categoryDto);
        }
        return dto;
    }

    public Product toEntity(ProductDto dto) {
        Product product = new Product();
        // product.setId(dto.getId());
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setImageUrl(dto.getImageUrl());

        if (dto.getCategory() != null) {
            Category category = new Category();
            category.setName(dto.getCategory().getName());
            category.setDescription(dto.getCategory().getDescription());
            category.setState(State.ACTIVE);
            product.setCategory(category);
        }
        return product;
    }
}
