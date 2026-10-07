package com.m15.kartzo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.m15.kartzo.entity.CartItem;
import com.m15.kartzo.entity.User;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

	List<CartItem> findByUser(User user);

}
