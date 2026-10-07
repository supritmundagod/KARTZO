package com.m15.kartzo.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.m15.kartzo.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

	boolean existsByName(String name);
	java.util.Optional<Product> findByName(String name);

	@Query("SELECT p FROM Product p WHERE " +
	       "(:keyword IS NULL OR :keyword = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
	       "(:category IS NULL OR :category = '' OR p.category = :category) AND " +
	       "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
	       "(:maxPrice IS NULL OR p.price <= :maxPrice)")
	Page<Product> searchProducts(@Param("keyword") String keyword, 
	                             @Param("category") String category, 
	                             @Param("minPrice") Double minPrice, 
	                             @Param("maxPrice") Double maxPrice, 
	                             Pageable pageable);

	@Query("SELECT DISTINCT p.category FROM Product p WHERE p.category IS NOT NULL AND p.category != ''")
	List<String> findDistinctCategories();
}
