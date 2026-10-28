package com.project.productcatalogservice.controller;

import com.project.productcatalogservice.dto.CategoryDto;
import com.project.productcatalogservice.dto.ProductDto;
import com.project.productcatalogservice.dto.ProductPitchDto;
import com.project.productcatalogservice.model.Product;
import com.project.productcatalogservice.service.IProductService;
import com.project.productcatalogservice.service.PitchService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final IProductService storageService;
    private final PitchService pitchService;
    private final IProductService supplierService;

    public ProductController(IProductService storageService, PitchService pitchService, @Qualifier("dummyProductService") IProductService supplierService) {
        this.storageService = storageService;
        this.pitchService = pitchService;
        this.supplierService = supplierService;
    }

    @GetMapping
    // API to get all products
    List<Product> getAllProducts(){
        return List.of();
    }

    @GetMapping("/printing")
    String test(){
        return "show printing";
    }

//    @GetMapping("/{id}")
//    ProductDto getProductById(@PathVariable("id") Long id){
//        return null;
//    }

//    (or)

//    @GetMapping("/{id}")
//    ProductDto getProductById(@PathVariable Long id){
//        return null;
//    }

//    (or)

//    @GetMapping("/{id}")
//    ResponseEntity<ProductDto> getProductById(@PathVariable("id") Long id){
//        return new ResponseEntity<>(new ProductDto(), HttpStatus.CREATED);
//    }


    @GetMapping("/{id}")
    ResponseEntity<ProductDto> getProductById(@PathVariable("id") Long id){
        if (id<0){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Product product = storageService.getProductById(id);
//        Product product = supplierService.getProductById(id);
        if (product == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(from(product), HttpStatus.OK);
    }

    private ProductDto from(Product product){
        ProductDto productDto = new ProductDto();
        productDto.setName(product.getName());
        productDto.setPrice(product.getPrice());
        productDto.setDescription(product.getDescription());

        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setName(product.getCategory().getName());
        categoryDto.setDescription(product.getCategory().getDescription());
        productDto.setCategory(categoryDto);


        return productDto;
    }

    @GetMapping("/{id}/pitch")
    public ResponseEntity<ProductPitchDto> generatePitch(@PathVariable Long id){
        if (id<0){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Product product = storageService.getProductById(id);
        if (product == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        ProductPitchDto productPitchDto = new ProductPitchDto();
        productPitchDto.setId(product.getId());
        productPitchDto.setPitch(pitchService.generatePitch(product));

        return new ResponseEntity<>(productPitchDto, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@RequestBody ProductDto productDto){
        Product product = storageService.createProduct(productDto);

        return new ResponseEntity<>(from(product), HttpStatus.CREATED);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id){

        boolean isDeleted = storageService.deleteProductById(id);
        if (isDeleted){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else{
            return new ResponseEntity<>("Not Found", HttpStatus.NOT_FOUND);
        }
    }

}
