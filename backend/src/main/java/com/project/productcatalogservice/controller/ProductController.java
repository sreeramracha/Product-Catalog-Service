package com.project.productcatalogservice.controller;

import com.project.productcatalogservice.dto.ProductDto;
import com.project.productcatalogservice.dto.ProductPitchDto;
import com.project.productcatalogservice.mapper.ProductMapper;
import com.project.productcatalogservice.model.Product;
import com.project.productcatalogservice.service.IProductService;
import com.project.productcatalogservice.service.PitchService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final IProductService productService;
    private final PitchService pitchService;
    private final IProductService supplierService;
    private final ProductMapper productMapper;

    public ProductController(IProductService productService, PitchService pitchService, @Qualifier("dummyProductService") IProductService supplierService, ProductMapper productMapper) {
        this.productService = productService;
        this.pitchService = pitchService;
        this.supplierService = supplierService;
        this.productMapper = productMapper;
    }

    @GetMapping
    // API to get all products
    List<ProductDto> getAllProducts(){
        List<Product> products = productService.getAllProducts();
        List<ProductDto> productDtos = new ArrayList<>();
        for(Product product : products){
            productDtos.add(productMapper.toDto(product));
        }

        return productDtos;
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

        Product product = productService.getProductById(id);
//        Product product = supplierService.getProductById(id);
        if (product == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(productMapper.toDto(product), HttpStatus.OK);
    }

    @GetMapping("/{id}/pitch")
    public ResponseEntity<ProductPitchDto> generatePitch(@PathVariable Long id){
        if (id<0){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Product product = productService.getProductById(id);
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
        Product product = productService.createProduct(productDto);

        return new ResponseEntity<>(productMapper.toDto(product), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> replaceProduct(@PathVariable Long id, @RequestBody ProductDto productDto) {
        if (id <= 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Product product = productService.replaceProduct(id, productDto);
        if (product == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(productMapper.toDto(product), HttpStatus.OK);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> patchProduct(@PathVariable Long id, @RequestBody ProductDto patch) {
        if (id <= 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        try {
            Product product = productService.patchProduct(id, patch);
            if (product == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(productMapper.toDto(product), HttpStatus.OK);
        } catch (IllegalArgumentException exception) {
            return new ResponseEntity<>(exception.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id){

        boolean isDeleted = productService.deleteProductById(id);
        if (isDeleted){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else{
            return new ResponseEntity<>("Not Found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/search")
    public PagedModel<ProductDto> getProductsInPriceRange(@RequestParam(required = false) BigDecimal minPrice,
                                              @RequestParam(required = false) BigDecimal maxPrice,
                                              Pageable pageable){

        Page<ProductDto> products = productService.getProductInPriceRange(minPrice, maxPrice, pageable).map(x -> productMapper.toDto(x));

        return new PagedModel<>(products);

    }

    @GetMapping("/healthcheck")
    public ResponseEntity<String> healthCheck(){
        return new ResponseEntity<>("Up and running", HttpStatus.OK);
    }

}
