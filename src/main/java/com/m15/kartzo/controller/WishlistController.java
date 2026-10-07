package com.m15.kartzo.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.m15.kartzo.dao.UserDao;
import com.m15.kartzo.entity.User;
import com.m15.kartzo.entity.WishlistItem;
import com.m15.kartzo.service.WishlistService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Controller
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private UserDao userDao;

    @GetMapping("/user/wishlist")
    public String viewWishlist(Principal principal, ModelMap map) {
        if (principal == null) {
            return "redirect:/login";
        }
        User user = userDao.findByEmail(principal.getName()).orElseThrow();
        List<WishlistItem> wishlist = wishlistService.getWishlistByUser(user);
        map.put("wishlist", wishlist);
        return "wishlist.html";
    }

    @GetMapping("/user/wishlist/add/{id}")
    public String addToWishlist(@PathVariable Long id, Principal principal, HttpSession session, HttpServletRequest request) {
        if (principal == null) {
            return "redirect:/login";
        }
        User user = userDao.findByEmail(principal.getName()).orElseThrow();
        try {
            wishlistService.addToWishlist(user, id);
            session.setAttribute("success", "Added to Wishlist");
        } catch (Exception e) {
            session.setAttribute("error", "Error adding to Wishlist");
        }
        String referer = request.getHeader("Referer");
        return "redirect:" + (referer != null ? referer : "/");
    }

    @GetMapping("/user/wishlist/remove/{id}")
    public String removeFromWishlist(@PathVariable Long id, Principal principal, HttpSession session, HttpServletRequest request) {
        if (principal == null) {
            return "redirect:/login";
        }
        User user = userDao.findByEmail(principal.getName()).orElseThrow();
        try {
            wishlistService.removeFromWishlist(user, id);
            session.setAttribute("success", "Removed from Wishlist");
        } catch (Exception e) {
            session.setAttribute("error", "Error removing from Wishlist");
        }
        String referer = request.getHeader("Referer");
        return "redirect:" + (referer != null ? referer : "/user/wishlist");
    }
}
