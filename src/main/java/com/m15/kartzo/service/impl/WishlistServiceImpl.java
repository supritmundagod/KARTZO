package com.m15.kartzo.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.m15.kartzo.entity.Product;
import com.m15.kartzo.entity.User;
import com.m15.kartzo.entity.WishlistItem;
import com.m15.kartzo.repository.ProductRepository;
import com.m15.kartzo.repository.WishlistItemRepository;
import com.m15.kartzo.service.WishlistService;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private WishlistItemRepository wishlistRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    @Transactional
    public void addToWishlist(User user, Long productId) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new IllegalArgumentException("Invalid product Id"));
        
        // Check if it already exists
        Optional<WishlistItem> existingItem = wishlistRepository.findByUserAndProduct(user, product);
        if (existingItem.isEmpty()) {
            WishlistItem item = new WishlistItem();
            item.setUser(user);
            item.setProduct(product);
            wishlistRepository.save(item);
        }
    }

    @Override
    @Transactional
    public void removeFromWishlist(User user, Long productId) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new IllegalArgumentException("Invalid product Id"));
        wishlistRepository.deleteByUserAndProduct(user, product);
    }

    @Override
    public List<WishlistItem> getWishlistByUser(User user) {
        return wishlistRepository.findByUser(user);
    }

    @Override
    public boolean isProductInWishlist(User user, Long productId) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) return false;
        return wishlistRepository.findByUserAndProduct(user, product).isPresent();
    }
}
