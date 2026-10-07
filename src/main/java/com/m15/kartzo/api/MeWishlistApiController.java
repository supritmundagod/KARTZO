package com.m15.kartzo.api;

import java.security.Principal;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.m15.kartzo.api.dto.WishlistAddRequest;
import com.m15.kartzo.api.dto.WishlistItemResponse;
import com.m15.kartzo.dao.UserDao;
import com.m15.kartzo.entity.User;
import com.m15.kartzo.service.WishlistService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/me/wishlist")
@RequiredArgsConstructor
public class MeWishlistApiController {

    private final WishlistService wishlistService;
    private final UserDao userDao;

    @GetMapping
    public List<WishlistItemResponse> getWishlist(Principal principal) {
        User user = userDao.findByEmail(principal.getName()).orElseThrow();
        return wishlistService.getWishlistByUser(user).stream()
                .map(item -> new WishlistItemResponse(
                        item.getId(),
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getPrice(),
                        item.getProduct().getImageLink(),
                        item.getProduct().getCategory()
                ))
                .toList();
    }

    @PostMapping
    public void addToWishlist(@RequestBody WishlistAddRequest request, Principal principal) {
        User user = userDao.findByEmail(principal.getName()).orElseThrow();
        wishlistService.addToWishlist(user, request.productId());
    }

    @DeleteMapping("/{productId}")
    public void removeFromWishlist(@PathVariable Long productId, Principal principal) {
        User user = userDao.findByEmail(principal.getName()).orElseThrow();
        wishlistService.removeFromWishlist(user, productId);
    }
}
