package com.m15.kartzo.api;

import java.security.Principal;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.m15.kartzo.api.dto.CheckoutLineResponse;
import com.m15.kartzo.api.dto.OrderSummaryResponse;
import com.m15.kartzo.dao.UserDao;
import com.m15.kartzo.entity.Order;
import com.m15.kartzo.entity.OrderItem;
import com.m15.kartzo.entity.User;
import com.m15.kartzo.repository.OrderRepository;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/me/orders")
@RequiredArgsConstructor
public class MeOrdersApiController {

	private final OrderRepository orderRepository;
	private final UserDao userDao;

	@GetMapping
	@Transactional(readOnly = true)
	public List<OrderSummaryResponse> list(Principal principal) {
		User user = userDao.findByEmail(principal.getName()).orElseThrow();
		List<Order> orders = orderRepository.findByUser(user);
		return orders.stream().map(this::toSummary).toList();
	}

	private OrderSummaryResponse toSummary(Order order) {
		List<CheckoutLineResponse> lines = order.getOrderItems() == null ? List.of()
				: order.getOrderItems().stream().map(this::toLine).toList();
		return new OrderSummaryResponse(
				order.getId(),
				order.getTotalAmount(),
				order.getDeliveryAddress(),
				order.getOrderDate(),
				order.getStatus(),
				order.getPaymentMethod(),
				order.getTrackingId(),
				order.getCourierPartner(),
				order.getEstimatedDeliveryDate(),
				lines);
	}

	private CheckoutLineResponse toLine(OrderItem oi) {
		var p = oi.getProduct();
		double line = Math.round(oi.getPrice() * oi.getQuantity() * 100.0) / 100.0;
		return new CheckoutLineResponse(p.getName(), p.getImageLink(), oi.getQuantity(), oi.getPrice(), line);
	}
}
