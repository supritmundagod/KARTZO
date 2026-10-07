package com.m15.kartzo.api.dto;

import java.time.LocalDateTime;
import java.util.List;

public record OrderSummaryResponse(
		Long id,
		double totalAmount,
		String deliveryAddress,
		LocalDateTime orderDate,
		String status,
		String paymentMethod,
		String trackingId,
		String courierPartner,
		LocalDateTime estimatedDeliveryDate,
		List<CheckoutLineResponse> lines) {
}
