package com.m15.kartzo.service;

import com.m15.kartzo.entity.Order;

public interface InvoiceService {
    byte[] generateInvoice(Order order) throws Exception;
}
