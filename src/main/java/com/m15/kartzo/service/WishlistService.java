package com.m15.kartzo.service;

import java.util.List;

import com.m15.kartzo.entity.User;
import com.m15.kartzo.entity.WishlistItem;

public interface WishlistService {
    void addToWishlist(User user, Long productId);
    void removeFromWishlist(User user, Long productId);
    List<WishlistItem> getWishlistByUser(User user);
    boolean isProductInWishlist(User user, Long productId);
}
