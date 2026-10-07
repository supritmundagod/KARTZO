package com.m15.kartzo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.m15.kartzo.entity.Product;
import com.m15.kartzo.entity.Review;
import com.m15.kartzo.entity.User;
import com.m15.kartzo.repository.OrderItemRepository;
import com.m15.kartzo.repository.ProductRepository;
import com.m15.kartzo.repository.ReviewRepository;
import com.m15.kartzo.service.ReviewService;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Override
    @Transactional
    public void addReview(User user, Long productId, int rating, String comment) throws Exception {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid product id"));

        if (!canUserReviewProduct(user, productId)) {
            throw new Exception("You must purchase the product before reviewing, and you can only review once.");
        }

        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setRating(rating);
        review.setComment(comment);

        reviewRepository.save(review);

        // Update product aggregates
        product.getReviews().add(review);
        int newCount = product.getReviews().size();
        double totalRating = product.getReviews().stream().mapToInt(Review::getRating).sum();
        double averageRating = Math.round((totalRating / newCount) * 10.0) / 10.0;

        product.setReviewCount(newCount);
        product.setAverageRating(averageRating);
        productRepository.save(product);
    }

    @Override
    public boolean canUserReviewProduct(User user, Long productId) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) return false;

        boolean hasPurchased = orderItemRepository.existsByOrderUserAndProduct(user, product);
        boolean hasReviewed = reviewRepository.existsByUserAndProduct(user, product);

        return hasPurchased && !hasReviewed;
    }
}
