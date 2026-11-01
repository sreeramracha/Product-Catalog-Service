package com.project.productcatalogservice.service;

import com.project.productcatalogservice.repository.CategoryRepository;
import org.springframework.stereotype.Service;

@Service
public class CategoryService implements ICategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    @Override
    public Double getAvgPriceForCategory(String category) {
        return categoryRepository.findAvgPriceForCatgory(category);
    }
}
