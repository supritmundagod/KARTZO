package com.m15.kartzo.api.dto;

import java.util.List;

public record CheckoutSessionResponse(
		String userName,
		String userEmail,
		String userContact,
		List<CheckoutLineResponse> items,
		double subTotal,
		double discountAmount,
		String appliedCouponCode,
		double total,
		String currency,
		String razorpayOrderId,
		String razorpayKeyId,
		boolean mockMode) {
}
