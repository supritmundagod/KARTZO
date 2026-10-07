package com.m15.kartzo.api;

import java.security.Principal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.m15.kartzo.api.dto.PagedProductsResponse;
import com.m15.kartzo.api.dto.ProductDetailResponse;
import com.m15.kartzo.api.dto.ProductSummaryResponse;
import com.m15.kartzo.api.dto.ReviewResponse;
import com.m15.kartzo.dao.UserDao;
import com.m15.kartzo.entity.Product;
import com.m15.kartzo.entity.Review;
import com.m15.kartzo.entity.User;
import com.m15.kartzo.repository.ProductRepository;
import com.m15.kartzo.repository.ReviewRepository;
import com.m15.kartzo.service.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/catalog")
@RequiredArgsConstructor
public class CatalogApiController {

	private final ProductRepository productRepository;
	private final ReviewRepository reviewRepository;
	private final ReviewService reviewService;
	private final UserDao userDao;

	@GetMapping("/products")
	public PagedProductsResponse listProducts(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "12") int size,
			@RequestParam(defaultValue = "name") String sort,
			@RequestParam(defaultValue = "asc") String direction,
			@RequestParam(required = false) String keyword,
			@RequestParam(required = false) String category,
			@RequestParam(required = false) Double minPrice,
			@RequestParam(required = false) Double maxPrice) {

		Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
		Sort sortObj = switch (sort.toLowerCase()) {
			case "price" -> Sort.by(sortDirection, "price");
			case "category" -> Sort.by(sortDirection, "category");
			case "newest" -> Sort.by(sortDirection, "id");
			default -> Sort.by(sortDirection, "name");
		};

		PageRequest pageable = PageRequest.of(page, size, sortObj);
		Page<Product> productPage = productRepository.searchProducts(keyword, category, minPrice, maxPrice, pageable);

		List<ProductSummaryResponse> content = productPage.getContent().stream().map(this::toSummary).toList();

		return new PagedProductsResponse(
				content,
				productPage.getNumber(),
				productPage.getSize(),
				productPage.getTotalElements(),
				productPage.getTotalPages(),
				sort,
				direction);
	}

	@GetMapping("/products/{id}")
	public ProductDetailResponse getProduct(@PathVariable Long id, Principal principal) {
		Product product = productRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Invalid product Id:" + id));

		List<ReviewResponse> reviews = reviewRepository.findByProduct_IdOrderByCreatedAtDesc(id).stream()
				.map(this::toReview)
				.toList();

		boolean canReview = false;
		if (principal != null) {
			User user = userDao.findByEmail(principal.getName()).orElse(null);
			if (user != null) {
				canReview = reviewService.canUserReviewProduct(user, id);
			}
		}

		return new ProductDetailResponse(toSummary(product), reviews, canReview);
	}

	@GetMapping("/categories")
	public List<String> categories() {
		return productRepository.findDistinctCategories();
	}

	private ProductSummaryResponse toSummary(Product p) {
		return new ProductSummaryResponse(
				p.getId(),
				p.getName(),
				p.getPrice(),
				p.getStock(),
				p.getDescription(),
				p.getImageLink(),
				p.getCategory(),
				p.getAverageRating(),
				p.getReviewCount());
	}

	private ReviewResponse toReview(Review r) {
		String author = r.getUser() != null ? r.getUser().getName() : "Customer";
		return new ReviewResponse(r.getId(), r.getRating(), r.getComment(), author, r.getCreatedAt());
	}
}
