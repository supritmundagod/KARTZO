package com.m15.kartzo.api;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.m15.kartzo.api.dto.CheckoutLineResponse;
import com.m15.kartzo.api.dto.CheckoutSessionResponse;
import com.m15.kartzo.api.dto.CouponCodeRequest;
import com.m15.kartzo.dao.UserDao;
import com.m15.kartzo.entity.CartItem;
import com.m15.kartzo.entity.Coupon;
import com.m15.kartzo.entity.User;
import com.m15.kartzo.repository.CartItemRepository;
import com.m15.kartzo.repository.CouponRepository;
import com.razorpay.RazorpayClient;

import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/me/checkout")
@RequiredArgsConstructor
public class MeCheckoutApiController {

	private final CartItemRepository cartItemRepository;
	private final CouponRepository couponRepository;
	private final UserDao userDao;

	@Value("${razorpay.id}")
	private String razorpayKeyId;

	@Value("${razorpay.secret}")
	private String razorpayKeySecret;

	@GetMapping("/session")
	@Transactional
	public ResponseEntity<CheckoutSessionResponse> session(Principal principal, HttpSession session) {
		User user = userDao.findByEmail(principal.getName()).orElseThrow();
		List<CartItem> items = cartItemRepository.findByUser(user);
		if (items.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}

		double total = items.stream().mapToDouble(x -> x.getProduct().getPrice() * x.getQuantity()).sum();

		double discountAmount = 0.0;
		Coupon appliedCoupon = null;
		String sessionCouponCode = (String) session.getAttribute("couponCode");

		if (sessionCouponCode != null) {
			Optional<Coupon> optCoupon = couponRepository.findByCode(sessionCouponCode);
			if (optCoupon.isPresent() && optCoupon.get().isActive()) {
				Coupon coupon = optCoupon.get();
				if (total >= coupon.getMinOrderAmount()) {
					double calculatedDiscount = total * (coupon.getDiscountPercentage() / 100.0);
					if (calculatedDiscount > coupon.getMaxDiscountAmount()) {
						calculatedDiscount = coupon.getMaxDiscountAmount();
					}
					discountAmount = calculatedDiscount;
					appliedCoupon = coupon;
				} else {
					session.removeAttribute("couponCode");
				}
			} else {
				session.removeAttribute("couponCode");
			}
		}

		double roundedTotal = Math.round((total - discountAmount) * 100.0) / 100.0;

		String razorpayOrderId;
		String keyId = razorpayKeyId;
		boolean mockMode;

		try {
			if (razorpayKeyId.contains("your-razorpay-key-id") || razorpayKeySecret.contains("your-razorpay-key-secret")) {
				razorpayOrderId = "mock_order_" + System.currentTimeMillis();
				keyId = "mock_key";
				mockMode = true;
			} else {
				RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
				JSONObject orderRequest = new JSONObject();
				orderRequest.put("amount", (int) (roundedTotal * 100));
				orderRequest.put("currency", "INR");
				orderRequest.put("receipt", "order_" + System.currentTimeMillis());
				com.razorpay.Order order = razorpay.orders.create(orderRequest);
				razorpayOrderId = order.get("id").toString();
				mockMode = false;
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}

		List<CheckoutLineResponse> lines = items.stream().map(item -> {
			var p = item.getProduct();
			double line = Math.round(p.getPrice() * item.getQuantity() * 100.0) / 100.0;
			return new CheckoutLineResponse(p.getName(), p.getImageLink(), item.getQuantity(), p.getPrice(), line);
		}).toList();

		CheckoutSessionResponse body = new CheckoutSessionResponse(
				user.getName(),
				user.getEmail(),
				user.getMobile() != null ? String.valueOf(user.getMobile()) : "",
				lines,
				Math.round(total * 100.0) / 100.0,
				Math.round(discountAmount * 100.0) / 100.0,
				appliedCoupon != null ? appliedCoupon.getCode() : null,
				roundedTotal,
				"INR",
				razorpayOrderId,
				keyId,
				mockMode);

		return ResponseEntity.ok(body);
	}

	@PostMapping("/coupon")
	public ResponseEntity<Void> applyCoupon(@RequestBody CouponCodeRequest req, Principal principal, HttpSession session) {
		if (req == null || req.code() == null || req.code().isBlank()) {
			return ResponseEntity.badRequest().build();
		}
		Optional<Coupon> optCoupon = couponRepository.findByCode(req.code().trim().toUpperCase());
		if (optCoupon.isEmpty() || !optCoupon.get().isActive()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
		Coupon coupon = optCoupon.get();
		User user = userDao.findByEmail(principal.getName()).orElseThrow();
		List<CartItem> items = cartItemRepository.findByUser(user);
		double cartTotal = items.stream().mapToDouble(x -> x.getProduct().getPrice() * x.getQuantity()).sum();
		if (cartTotal < coupon.getMinOrderAmount()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
		session.setAttribute("couponCode", coupon.getCode());
		return ResponseEntity.ok().build();
	}

	@DeleteMapping("/coupon")
	public ResponseEntity<Void> removeCoupon(HttpSession session) {
		session.removeAttribute("couponCode");
		return ResponseEntity.noContent().build();
	}
}
