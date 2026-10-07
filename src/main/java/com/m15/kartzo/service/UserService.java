package com.m15.kartzo.service;

import java.security.Principal;

import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;

import com.m15.kartzo.dto.PasswordDto;
import com.m15.kartzo.dto.UserDto;
import com.m15.kartzo.entity.User;

import jakarta.servlet.http.HttpSession;

public interface UserService {
	String registerUser(UserDto userDto, BindingResult result, HttpSession session);

	String confirmOtp(Long id, int otp, HttpSession session);

	String resendOtp(Long id, HttpSession session);

	String forgotPassword(String email, HttpSession session);

	String resetPassword(PasswordDto passwordDto, BindingResult result, HttpSession session, Long id, ModelMap map);

	String addToCart(Long id, HttpSession session, Principal principal);

	String viewCart(HttpSession session, Principal principal, ModelMap map);

	String increase(HttpSession session, Long id, ModelMap map);

	String decrease(HttpSession session, Long id, ModelMap map);

	String checkout(HttpSession session, Principal principal, ModelMap map);

	String paymentSuccess(String paymentId, String orderId, String signature, String address, String paymentMethod, Principal principal, HttpSession session,
			ModelMap map);

	String viewOrders(Principal principal, HttpSession session, ModelMap map);

	String applyCoupon(String code, HttpSession session, Principal principal);

	String removeCoupon(HttpSession session);

	String loadProfile(Principal principal, ModelMap map);

	String updateProfile(User user, Principal principal, HttpSession session);

	String changePassword(String oldPassword, String newPassword, String confirmPassword, Principal principal, HttpSession session);
}
