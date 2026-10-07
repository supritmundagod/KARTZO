package com.m15.kartzo.api.dto;

import java.util.List;

public record PagedProductsResponse(
		List<ProductSummaryResponse> content,
		int page,
		int size,
		long totalElements,
		int totalPages,
		String sort,
		String direction) {
}
