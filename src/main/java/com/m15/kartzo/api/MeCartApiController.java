package com.m15.kartzo.api;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.m15.kartzo.api.dto.AddToCartRequest;
import com.m15.kartzo.api.dto.CartLineResponse;
import com.m15.kartzo.api.dto.CartResponse;
import com.m15.kartzo.api.dto.ProductSummaryResponse;
import com.m15.kartzo.dao.UserDao;
import com.m15.kartzo.entity.CartItem;
import com.m15.kartzo.entity.Product;
import com.m15.kartzo.entity.User;
import com.m15.kartzo.repository.CartItemRepository;
import com.m15.kartzo.repository.ProductRepository;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/me/cart")
@RequiredArgsConstructor
public class MeCartApiController {

	private final CartItemRepository cartItemRepository;
	private final ProductRepository productRepository;
	private final UserDao userDao;

	@GetMapping
	public CartResponse getCart(Principal principal) {
		User user = userDao.findByEmail(principal.getName()).orElseThrow();
		List<CartItem> items = cartItemRepository.findByUser(user);
		if (items.isEmpty()) {
			return new CartResponse(List.of(), 0.0, true);
		}
		List<CartLineResponse> lines = items.stream().map(this::toLine).toList();
		double subTotal = lines.stream().mapToDouble(CartLineResponse::lineTotal).sum();
		double rounded = Math.round(subTotal * 100.0) / 100.0;
		return new CartResponse(lines, rounded, false);
	}

	@PostMapping("/items")
	@Transactional
	public ResponseEntity<CartResponse> addItem(Principal principal, @RequestBody AddToCartRequest body) {
		if (body == null || body.productId() == null) {
			return ResponseEntity.badRequest().build();
		}
		Product product = productRepository.findById(body.productId()).orElseThrow();
		if (product.getStock() <= 0) {
			return ResponseEntity.status(HttpStatus.CONFLICT).build();
		}
		User user = userDao.findByEmail(principal.getName()).orElseThrow();
		List<CartItem> items = cartItemRepository.findByUser(user);

		if (items.isEmpty()) {
			CartItem item = new CartItem();
			item.setUser(user);
			item.setProduct(product);
			item.setQuantity(1);
			cartItemRepository.save(item);
		} else {
			boolean merged = false;
			for (CartItem item : items) {
				if (item.getProduct().getId().equals(product.getId())) {
					item.setQuantity(item.getQuantity() + 1);
					cartItemRepository.save(item);
					merged = true;
					break;
				}
			}
			if (!merged) {
				CartItem item = new CartItem();
				item.setUser(user);
				item.setProduct(product);
				item.setQuantity(1);
				cartItemRepository.save(item);
			}
		}
		product.setStock(product.getStock() - 1);
		productRepository.save(product);

		return ResponseEntity.ok(getCart(principal));
	}

	@PostMapping("/items/{cartItemId}/increment")
	@Transactional
	public ResponseEntity<CartResponse> increment(@PathVariable Long cartItemId, Principal principal) {
		User user = userDao.findByEmail(principal.getName()).orElseThrow();
		CartItem item = cartItemRepository.findById(cartItemId).orElseThrow();
		if (!item.getUser().getId().equals(user.getId())) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
		Product product = item.getProduct();
		if (product.getStock() <= 0) {
			return ResponseEntity.status(HttpStatus.CONFLICT).build();
		}
		item.setQuantity(item.getQuantity() + 1);
		cartItemRepository.save(item);
		product.setStock(product.getStock() - 1);
		productRepository.save(product);
		return ResponseEntity.ok(getCart(principal));
	}

	@PostMapping("/items/{cartItemId}/decrement")
	@Transactional
	public ResponseEntity<CartResponse> decrement(@PathVariable Long cartItemId, Principal principal) {
		User user = userDao.findByEmail(principal.getName()).orElseThrow();
		CartItem item = cartItemRepository.findById(cartItemId).orElseThrow();
		if (!item.getUser().getId().equals(user.getId())) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
		Product product = item.getProduct();
		if (item.getQuantity() > 1) {
			item.setQuantity(item.getQuantity() - 1);
			cartItemRepository.save(item);
			product.setStock(product.getStock() + 1);
			productRepository.save(product);
		} else {
			cartItemRepository.delete(item);
		}
		return ResponseEntity.ok(getCart(principal));
	}

	private CartLineResponse toLine(CartItem item) {
		Product p = item.getProduct();
		ProductSummaryResponse summary = new ProductSummaryResponse(
				p.getId(),
				p.getName(),
				p.getPrice(),
				p.getStock(),
				p.getDescription(),
				p.getImageLink(),
				p.getCategory(),
				p.getAverageRating(),
				p.getReviewCount());
		double lineTotal = Math.round(p.getPrice() * item.getQuantity() * 100.0) / 100.0;
		return new CartLineResponse(item.getId(), summary, item.getQuantity(), lineTotal);
	}
}
