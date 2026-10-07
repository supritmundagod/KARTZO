package com.m15.kartzo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.m15.kartzo.dto.ProductDto;
import com.m15.kartzo.entity.Coupon;
import com.m15.kartzo.entity.Product;
import com.m15.kartzo.repository.CouponRepository;
import com.m15.kartzo.service.AdminService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@Controller
@RequestMapping("/admin")
public class AdminController {

	@Autowired
	AdminService adminService;

	@Autowired
	CouponRepository couponRepository;

	@GetMapping("/dashboard")
	public String loadDashboard(ModelMap map) {
		map.put("dashboardData", adminService.getDashboardData());
		return "admin-dashboard.html";
	}

	@GetMapping("/add-product")
	public String loadAddProduct(ProductDto productDto) {
		return "add-product.html";
	}

	@PostMapping("/add-product")
	public String addProduct(@Valid ProductDto productDto, BindingResult result, HttpSession session) {
		return adminService.addProduct(productDto, result, session);
	}

	@GetMapping("/delete/{id}")
	public String deleteProduct(@PathVariable Long id, HttpSession session) {
		return adminService.deleteProduct(id, session);
	}

	@GetMapping("/edit/{id}")
	public String editProduct(@PathVariable Long id, ModelMap map) {
		return adminService.editProduct(id, map);
	}

	@PostMapping("/update-product")
	public String updateProduct(Product product,@RequestParam MultipartFile image ,HttpSession session) {
		return adminService.updateProduct(product, image, session);
	}

	@GetMapping("/coupons")
	public String loadCoupons(ModelMap map) {
		map.put("coupons", couponRepository.findAll());
		return "admin-coupons.html";
	}

	@PostMapping("/add-coupon")
	public String addCoupon(Coupon coupon, HttpSession session) {
		if (coupon.getCode() != null) {
			coupon.setCode(coupon.getCode().toUpperCase());
		}
		coupon.setActive(true);
		couponRepository.save(coupon);
		session.setAttribute("success", "Coupon added successfully!");
		return "redirect:/admin/coupons";
	}

	@GetMapping("/delete-coupon/{id}")
	public String deleteCoupon(@PathVariable Long id, HttpSession session) {
		couponRepository.deleteById(id);
		session.setAttribute("success", "Coupon deleted successfully!");
		return "redirect:/admin/coupons";
	}

	@GetMapping("/orders")
	public String loadOrders(ModelMap map) {
		return adminService.getAllOrders(map);
	}

	@PostMapping("/update-order-status")
	public String updateOrderStatus(@RequestParam Long orderId, @RequestParam String status, HttpSession session) {
		return adminService.updateOrderStatus(orderId, status, session);
	}
}
