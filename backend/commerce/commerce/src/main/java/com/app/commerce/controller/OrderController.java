package com.app.commerce.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.commerce.dto.CheckoutRequest;
import com.app.commerce.dto.OrderResponse;
import com.app.commerce.service.OrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

	private final OrderService orderService;

	public OrderController(OrderService orderService) {
		this.orderService = orderService;
	}

	@GetMapping
	public List<OrderResponse> getOrders(@RequestHeader("X-Username") String username) {
		return orderService.getOrders(username);
	}

	@PostMapping("/checkout")
	public OrderResponse checkout(@RequestHeader("X-Username") String username,
			@Valid @RequestBody CheckoutRequest request) {
		return orderService.checkout(username, request);
	}
}
