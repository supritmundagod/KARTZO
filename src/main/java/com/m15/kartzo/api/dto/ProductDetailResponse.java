package com.m15.kartzo.api.dto;

import java.util.List;

public record ProductDetailResponse(
		ProductSummaryResponse product,
		List<ReviewResponse> reviews,
		boolean canReview) {
}
