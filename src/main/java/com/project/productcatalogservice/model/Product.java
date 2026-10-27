package com.project.productcatalogservice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
public class Product extends BaseEntity {
    private String name;
//    private Double price; // BigDecimal -> very precise

    @Column(precision = 19, scale = 3) // Eg: 1111111111111111.111
    private BigDecimal price;

    private String description;
    private String imageUrl;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "category_id")
    private Category category;
}
