package com.m15.kartzo.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import com.m15.kartzo.dto.PasswordDto;
import com.m15.kartzo.dto.UserDto;
import com.m15.kartzo.entity.Order;
import com.m15.kartzo.entity.User;
import com.m15.kartzo.repository.OrderRepository;
import com.m15.kartzo.service.UserService;
import com.m15.kartzo.service.InvoiceService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@Controller
public class UserController {

	@Autowired
	UserService userService;

	@Autowired
	OrderRepository orderRepository;

	@Autowired
	InvoiceService invoiceService;

	@PostMapping("/register")
	public String register(@Valid UserDto userDto, BindingResult result, HttpSession session) {
		return userService.registerUser(userDto, result, session);
	}

	@PostMapping("/otp")
	public String confirmOtp(@RequestParam Long id, @RequestParam int otp, HttpSession session) {
		return userService.confirmOtp(id, otp, session);
	}

	@GetMapping("/resend-otp")
	public String resendOtp(@RequestParam Long id, HttpSession session) {
		return userService.resendOtp(id, session);
	}

	@PostMapping("/forgot-password")
	public String forgotPassword(@RequestParam String email, HttpSession session) {
		return userService.forgotPassword(email, session);
	}

	@PostMapping("/reset-password")
	public String resetPassword(@Valid PasswordDto passwordDto, @RequestParam Long id, BindingResult result,
			HttpSession session, ModelMap map) {
		return userService.resetPassword(passwordDto, result, session, id, map);
	}

	@GetMapping("/user/add-cart/{id}")
	public String addToCart(@PathVariable Long id, HttpSession session, Principal principal) {
		return userService.addToCart(id, session, principal);
	}

	@GetMapping("/user/cart")
	public String viewCart(HttpSession session, Principal principal, ModelMap map) {
		return userService.viewCart(session, principal, map);
	}

	@GetMapping("/user/cart/increase/{id}")
	public String increase(@PathVariable Long id, HttpSession session, ModelMap map) {
		return userService.increase(session, id, map);
	}

	@GetMapping("/user/cart/decrease/{id}")
	public String decrease(@PathVariable Long id, HttpSession session, ModelMap map) {
		return userService.decrease(session, id, map);
	}

	@GetMapping("/user/checkout")
	public String checkout(HttpSession session, Principal principal, ModelMap map) {
		return userService.checkout(session, principal, map);
	}

	@GetMapping("/user/payment/success")
	public String paymentSuccess(@RequestParam("paymentId") String paymentId, @RequestParam("orderId") String orderId,
			@RequestParam("signature") String signature, @RequestParam("address") String address,
			@RequestParam(value = "method", required = false, defaultValue = "UNKNOWN") String method,
			Principal principal, HttpSession session,
			ModelMap map) {
		return userService.paymentSuccess(paymentId, orderId, signature, address, method, principal, session, map);
	}

	@GetMapping("/user/orders")
	public String viewOrders(Principal principal, HttpSession session, ModelMap map) {
		return userService.viewOrders(principal, session, map);
	}

	@PostMapping("/user/apply-coupon")
	public String applyCoupon(@RequestParam String code, HttpSession session, Principal principal) {
		return userService.applyCoupon(code, session, principal);
	}

	@GetMapping("/user/remove-coupon")
	public String removeCoupon(HttpSession session) {
		return userService.removeCoupon(session);
	}

	@GetMapping("/user/order/{id}/invoice")
	public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long id, Principal principal) throws Exception {
		Order order = orderRepository.findById(id).orElseThrow();
		if (!order.getUser().getEmail().equals(principal.getName())) {
			return ResponseEntity.status(403).build();
		}
		
		byte[] pdfBytes = invoiceService.generateInvoice(order);
		
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_PDF);
		headers.setContentDispositionFormData("attachment", "invoice_" + id + ".pdf");
		headers.setContentLength(pdfBytes.length);
		
		return ResponseEntity.ok()
				.headers(headers)
				.body(pdfBytes);
	}

	@GetMapping("/user/profile")
	public String loadProfile(Principal principal, ModelMap map) {
		return userService.loadProfile(principal, map);
	}

	@PostMapping("/user/update-profile")
	public String updateProfile(User user, Principal principal, HttpSession session) {
		return userService.updateProfile(user, principal, session);
	}

	@PostMapping("/user/change-password")
	public String changePassword(@RequestParam String oldPassword, @RequestParam String newPassword, 
								 @RequestParam String confirmPassword, Principal principal, HttpSession session) {
		return userService.changePassword(oldPassword, newPassword, confirmPassword, principal, session);
	}
}
