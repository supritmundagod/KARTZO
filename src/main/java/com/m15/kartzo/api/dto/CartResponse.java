package com.m15.kartzo.api.dto;

import java.util.List;

public record CartResponse(
		List<CartLineResponse> items,
		double subTotal,
		boolean empty) {
}
