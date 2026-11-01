package com.project.productcatalogservice.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductDto {
    private Long id;
    private String name;
//    private Double price; // BigDecimal -> very precise
    private BigDecimal price;
    private String description;
    private CategoryDto category;
    private String imageUrl;
}
