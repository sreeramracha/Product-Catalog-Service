package com.project.productcatalogservice.mappers;

import com.project.productcatalogservice.dto.ProductDto;
import com.project.productcatalogservice.mapper.ProductMapper;
import com.project.productcatalogservice.model.Category;
import com.project.productcatalogservice.model.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

public class ProductMapperTest {

    Product product;

    @BeforeEach
    public void setup() {
        product = new Product();
    }

    @Test
    public void testWhenValidEntity_thenReturnValidDto() {
        ProductMapper mapper = new ProductMapper();
        Category category = new Category();
        category.setName("beauty");
        product.setId(1L);
        product.setName("Mascara");
        product.setPrice(new BigDecimal("9.99"));
        product.setCategory(category);

        ProductDto dto = mapper.toDto(product);

        assertEquals(dto.getId(),1L);
        assertEquals(dto.getName(),"Mascara");
        assertEquals(dto.getPrice(),new BigDecimal("9.99"));
        assertEquals(dto.getCategory().getName(),"beauty");

    }

    @Test
    public void whenCategoryNotMapped_thenIsNull(){
        // Arrange
        ProductMapper mapper = new ProductMapper();

        product.setName("Mascara");

        // Act
        ProductDto dto = mapper.toDto(product);

        // Assert - If assert is not written, then test always passes
        assertNull(dto.getCategory());
    }
}
