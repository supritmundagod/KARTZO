package com.m15.kartzo.api.dto;

public record ProductSummaryResponse(
		Long id,
		String name,
		Double price,
		Integer stock,
		String description,
		String imageLink,
		String category,
		Double averageRating,
		Integer reviewCount) {
}
