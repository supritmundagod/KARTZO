package com.m15.kartzo.api.dto;

public record CartLineResponse(
		Long cartItemId,
		ProductSummaryResponse product,
		int quantity,
		double lineTotal) {
}
