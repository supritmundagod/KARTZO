package com.m15.kartzo.api.dto;

public record CheckoutLineResponse(
		String productName,
		String imageLink,
		int quantity,
		double unitPrice,
		double lineTotal) {
}
