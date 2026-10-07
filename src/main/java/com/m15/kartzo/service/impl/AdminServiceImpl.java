package com.m15.kartzo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.multipart.MultipartFile;

import com.m15.kartzo.dao.UserDao;
import com.m15.kartzo.dto.DashboardDto;
import com.m15.kartzo.dto.ProductDto;
import com.m15.kartzo.entity.Order;
import com.m15.kartzo.entity.Product;
import com.m15.kartzo.repository.OrderRepository;
import com.m15.kartzo.repository.ProductRepository;
import com.m15.kartzo.service.AdminService;
import com.m15.kartzo.util.CloudinaryHelper;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@Service
@SuppressWarnings("null")
public class AdminServiceImpl implements AdminService {

	@Autowired
	ProductRepository productRepository;

	@Autowired
	CloudinaryHelper cloudinaryHelper;

	@Autowired
	OrderRepository orderRepository;

	@Autowired
	UserDao userDao;

	@Override
	public String addProduct(@Valid ProductDto productDto, BindingResult result, HttpSession session) {
		if (productDto.getImage().isEmpty())
			result.rejectValue("image", "error.image", "* Image is Required");
		if (productRepository.existsByName(productDto.getName()))
			result.rejectValue("name", "error.name", "* Product Already Exists");

		if (result.hasErrors())
			return "add-product.html";
		else {
			Product product = new Product();
			product.setName(productDto.getName());
			product.setPrice(productDto.getPrice());
			product.setStock(productDto.getStock());
			product.setDescription(productDto.getDescription());
			product.setImageLink(cloudinaryHelper.saveToCloudinary(productDto.getImage()));
			product.setCategory(productDto.getCategory());
			productRepository.save(product);
			session.setAttribute("success", "Product Added Succes");
			return "redirect:/";
		}

	}

	@Override
	public String deleteProduct(Long id, HttpSession session) {
		productRepository.deleteById(id);
		session.setAttribute("success", "Product Deleted Success");
		return "redirect:/";
	}

	@Override
	public String editProduct(Long id, ModelMap map) {
		Product product = productRepository.findById(id).orElseThrow();
		map.put("product", product);
		return "edit.html";
	}

	@Override
	public String updateProduct(Product product, MultipartFile image, HttpSession session) {
		if (image.isEmpty())
			product.setImageLink(productRepository.findById(product.getId()).get().getImageLink());
		else
			product.setImageLink(cloudinaryHelper.saveToCloudinary(image));
		productRepository.save(product);
		session.setAttribute("success", "Product Updated Success");
		return "redirect:/";
	}

	@Override
	public DashboardDto getDashboardData() {
		DashboardDto dto = new DashboardDto();
		
		dto.setTotalRevenue(orderRepository.getTotalRevenue());
		dto.setTotalOrders(orderRepository.count());
		dto.setTotalProducts(productRepository.count());
		dto.setTotalUsers(userDao.countByRole("ROLE_USER"));
		dto.setRecentOrders(orderRepository.findTop10ByOrderByOrderDateDesc());

		return dto;
	}

	@Override
	public String getAllOrders(ModelMap map) {
		map.put("orders", orderRepository.findAll());
		return "admin-orders.html";
	}

	@Override
	public String updateOrderStatus(Long orderId, String status, HttpSession session) {
		Order order = orderRepository.findById(orderId).orElseThrow();
		order.setStatus(status.toUpperCase());
		orderRepository.save(order);
		session.setAttribute("success", "Order #" + orderId + " status updated to " + status);
		return "redirect:/admin/orders";
	}

}
