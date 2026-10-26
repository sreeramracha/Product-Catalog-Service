package com.project.productcatalogservice.service;

import com.project.productcatalogservice.dto.DummyJsonProductDto;
import com.project.productcatalogservice.model.Category;
import com.project.productcatalogservice.model.Product;
import org.springframework.boot.restclient.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
public class DummyProductService implements  IProductService{

//    The following three can be used to use third party apis
//    Rest Template
//    Rest Client
//    Feign Client

    private RestTemplate restTemplate;

    public DummyProductService(RestTemplateBuilder builder) {
        this.restTemplate = builder.build();
    }

    @Override
    public Product getProductById(Long id) {
        try {
            ResponseEntity<DummyJsonProductDto> dummyJsonProductDto = restTemplate.getForEntity("https://dummyjson.com/products/{id}", DummyJsonProductDto.class, id);
            if (dummyJsonProductDto.getStatusCode().is2xxSuccessful()) {
                return from(dummyJsonProductDto.getBody());
            }
            return null;

        } catch (HttpClientErrorException e) {
            return null;
        }

    }

    public Product from(DummyJsonProductDto dto){
        Product product = new Product();
        product.setId(dto.getId());
        product.setName(dto.getTitle());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setImageUrl(dto.getThumbnail());

        Category category = new Category();
        category.setName(dto.getCategory());

        product.setCategory(category);

        return product;
    }
}
