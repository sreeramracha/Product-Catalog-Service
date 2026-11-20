package com.project.productcatalogservice.services;


import com.project.productcatalogservice.model.Product;
import com.project.productcatalogservice.model.enums.State;
import com.project.productcatalogservice.repository.ProductRepository;
import com.project.productcatalogservice.service.StorageProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;


@SpringBootTest
@ActiveProfiles("test")
public class ProductServiceIntegrationTests {

    @Autowired
    private StorageProductService service;

    @Autowired
    private ProductRepository productRepo;

    @Value("${spring.datasource.url}")
    private String databaseUrl;

    @BeforeEach
    void emptyTheTestSchema() {
        assertThat(databaseUrl).as("this test deletes every product, so it must use the test schema").contains("_test");
        productRepo.deleteAll();
        productRepo.save(productWithPrice("Pen", "50.00"));
        productRepo.save(productWithPrice("Lamp", "150.00"));
        productRepo.save(productWithPrice("Chair", "250.00"));
    }

    private Product productWithPrice(String name, String price) {
        Product product = new Product();
        product.setName(name);
        product.setPrice(new BigDecimal(price));
        product.setState(State.ACTIVE);
        return product;
    }

    @Test
    void searchProducts_onlyMinPrice_returnsTheProductsFromThatPriceUp() {
        Page<Product> page = service.getProductInPriceRange(new BigDecimal("100"), null, PageRequest.of(0, 10));
        assertThat(page.getContent()).extracting(Product::getName).containsExactlyInAnyOrder("Lamp", "Chair");
    }
}