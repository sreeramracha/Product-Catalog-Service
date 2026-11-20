package com.project.productcatalogservice.services;

import com.project.productcatalogservice.dto.ProductDto;
import com.project.productcatalogservice.mapper.ProductMapper;
import com.project.productcatalogservice.model.Category;
import com.project.productcatalogservice.model.Product;
import com.project.productcatalogservice.repository.CategoryRepository;
import com.project.productcatalogservice.repository.ProductRepository;
import com.project.productcatalogservice.service.StorageProductService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
public class StorageProductServiceTests {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductMapper productMapper;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private StorageProductService storageProductService;

    @Test
    void createProduct_clientSendsAnId_savesWithoutItAndWithDates() {
        ProductDto input = new ProductDto();
        input.setId(UUID.randomUUID());
        input.setName("Mascara");

        Product product = new Product();
        // product.setId(dto.getId());
        product.setName("Mascara");
        product.setCategory(new Category());

        when(productRepository.save(any(Product.class)))
                .thenAnswer(call -> call.getArgument(0));

        when(productMapper.toEntity(any(ProductDto.class)))
                .thenReturn(product);

        Product result = storageProductService.createProduct(input);

        assertThat(result.getName()).isEqualTo("Mascara");

        ArgumentCaptor<Product> captor = ArgumentCaptor.forClass(Product.class);
        verify(productRepository).save(captor.capture());  // m
        assertThat(captor.getValue().getId()).isNull();
        assertThat(captor.getValue().getCreatedAt()).isNotNull();
        assertThat(captor.getValue().getUpdatedAt()).isNotNull();

    }


    // Unit tests
    // integration tests - E2E don't mock the externals calls

    // search product - catch minPrice maxPrice bug
}
