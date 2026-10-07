package com.m15.kartzo.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.m15.kartzo.dao.UserDao;
import com.m15.kartzo.entity.Product;
import com.m15.kartzo.entity.User;
import com.m15.kartzo.repository.ProductRepository;
import com.m15.kartzo.service.ReviewService;

@Controller
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private UserDao userDao;

    @GetMapping("/product/{id}")
    public String productDetails(@PathVariable Long id, ModelMap map, Principal principal) {
        Product product = productRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid product Id:" + id));
        map.put("product", product);

        boolean canReview = false;
        if (principal != null) {
            User user = userDao.findByEmail(principal.getName()).orElse(null);
            if (user != null) {
                canReview = reviewService.canUserReviewProduct(user, id);
            }
        }
        map.put("canReview", canReview);
        return "product-details.html";
    }

    @PostMapping("/product/{id}/review")
    public String addReview(@PathVariable Long id, 
                            @RequestParam int rating, 
                            @RequestParam String comment, 
                            Principal principal, 
                            RedirectAttributes redirectAttributes) {
        if (principal == null) {
            return "redirect:/login";
        }
        
        User user = userDao.findByEmail(principal.getName()).orElse(null);
        if (user == null) {
            return "redirect:/login";
        }

        try {
            reviewService.addReview(user, id, rating, comment);
            redirectAttributes.addFlashAttribute("success", "Review submitted successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
        }

        return "redirect:/product/" + id;
    }
}
