package com.project.productcatalogservice.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class ProductDto {
    private UUID id;
    private String name;
//    private Double price; // BigDecimal -> very precise
    private BigDecimal price;
    private String description;
    private CategoryDto category;
    private String imageUrl;
}
