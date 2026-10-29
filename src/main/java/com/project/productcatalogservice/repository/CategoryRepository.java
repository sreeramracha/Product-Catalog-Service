package com.project.productcatalogservice.repository;

import com.project.productcatalogservice.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);

//    JPQL Way
    @Query(value = "SELECT AVG(p.price) FROM Product p " +
            "where p.category.name=:categoryName")
    Double findAvgPriceForCatgory(String categoryName);

//    SQL Way
//    @Query(value = "SELECT AVG(p.price) from product p " +
//            "JOIN category c " +
//            "ON p.category_id = c.id " +
//            "where c.name=:categoryName", nativeQuery = true)
//    Double findAvgPriceForCatgory(String categoryName);

}
