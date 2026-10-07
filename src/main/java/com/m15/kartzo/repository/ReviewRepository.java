package com.m15.kartzo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.m15.kartzo.entity.Product;
import com.m15.kartzo.entity.Review;
import com.m15.kartzo.entity.User;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    boolean existsByUserAndProduct(User user, Product product);
    long countByProduct(Product product);

    List<Review> findByProduct_IdOrderByCreatedAtDesc(Long productId);
}
