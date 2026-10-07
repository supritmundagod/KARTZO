package com.m15.kartzo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.m15.kartzo.entity.OrderItem;
import com.m15.kartzo.entity.Product;
import com.m15.kartzo.entity.User;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    boolean existsByOrderUserAndProduct(User user, Product product);
}
