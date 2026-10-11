package com.project.productcatalogservice.dto;

import com.project.productcatalogservice.model.Category;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDto {
    private String name;
    private Double price; // BigDecimal -> very precise
    private String description;
    private CategoryDto category;
}
