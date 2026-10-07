package com.m15.kartzo.api.dto;

public record WishlistItemResponse(
    Long id,
    Long productId,
    String name,
    Double price,
    String imageLink,
    String category
) {}
