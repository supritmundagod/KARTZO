package com.m15.kartzo.api;

import java.security.Principal;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.m15.kartzo.api.dto.ReviewCreateRequest;
import com.m15.kartzo.dao.UserDao;
import com.m15.kartzo.entity.User;
import com.m15.kartzo.service.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/me/products")
@RequiredArgsConstructor
public class MeReviewApiController {

	private final ReviewService reviewService;
	private final UserDao userDao;

	@PostMapping("/{productId}/reviews")
	public ResponseEntity<Void> addReview(
			@PathVariable Long productId,
			@RequestBody ReviewCreateRequest body,
			Principal principal) {
		if (principal == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		if (body == null || body.rating() < 1 || body.rating() > 5) {
			return ResponseEntity.badRequest().build();
		}
		User user = userDao.findByEmail(principal.getName()).orElseThrow();
		try {
			reviewService.addReview(user, productId, body.rating(), body.comment() != null ? body.comment() : "");
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}
}
