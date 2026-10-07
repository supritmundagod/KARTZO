package com.m15.kartzo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.m15.kartzo.entity.Order;
import com.m15.kartzo.entity.User;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    Order findByRazorpayOrderId(String razorpayOrderId);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status = 'PAID'")
    Double getTotalRevenue();

    List<Order> findTop10ByOrderByOrderDateDesc();
}
