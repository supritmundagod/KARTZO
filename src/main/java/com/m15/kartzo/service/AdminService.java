package com.m15.kartzo.service;

import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.multipart.MultipartFile;

import com.m15.kartzo.dto.DashboardDto;
import com.m15.kartzo.dto.ProductDto;
import com.m15.kartzo.entity.Product;

import jakarta.servlet.http.HttpSession;

public interface AdminService {

	String addProduct(ProductDto productDto, BindingResult result, HttpSession session);

	String deleteProduct(Long id, HttpSession session);

	String editProduct(Long id, ModelMap map);

	String updateProduct(Product product, MultipartFile image, HttpSession session);

	DashboardDto getDashboardData();

	String getAllOrders(ModelMap map);

	String updateOrderStatus(Long orderId, String status, HttpSession session);
}
