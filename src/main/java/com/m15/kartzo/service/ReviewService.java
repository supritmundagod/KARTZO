package com.m15.kartzo.service;

import com.m15.kartzo.entity.User;

public interface ReviewService {
    void addReview(User user, Long productId, int rating, String comment) throws Exception;
    boolean canUserReviewProduct(User user, Long productId);
}
