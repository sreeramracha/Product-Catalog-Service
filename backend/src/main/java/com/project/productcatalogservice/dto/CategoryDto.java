package com.project.productcatalogservice.dto;

import com.project.productcatalogservice.model.Product;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class CategoryDto {
    private UUID id;
    private String name;
    private String description;
}
