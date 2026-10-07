package com.m15.kartzo.dto;

import java.util.List;

import com.m15.kartzo.entity.Order;

import lombok.Data;

@Data
public class DashboardDto {
    private Double totalRevenue;
    private Long totalOrders;
    private Long totalUsers;
    private Long totalProducts;
    private List<Order> recentOrders;
}
