package com.project.productcatalogservice.controller;

import com.project.productcatalogservice.model.Product;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ProductController {

    @GetMapping("/products")
    // API to get all products
    List<Product> getAllProducts(){
        return List.of();
    }

    @GetMapping("/printing")
    String test(){
        return "show printing";
    }

}
