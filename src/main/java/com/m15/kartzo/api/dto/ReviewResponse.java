package com.m15.kartzo.api.dto;

import java.time.LocalDateTime;

public record ReviewResponse(
		Long id,
		Integer rating,
		String comment,
		String authorName,
		LocalDateTime createdAt) {
}
