package com.app.commerce.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.commerce.dto.CartItemRequest;
import com.app.commerce.dto.CartItemResponse;
import com.app.commerce.service.CustomerCollectionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

	private final CustomerCollectionService customerCollectionService;

	public CartController(CustomerCollectionService customerCollectionService) {
		this.customerCollectionService = customerCollectionService;
	}

	@GetMapping
	public List<CartItemResponse> getCart(@RequestHeader("X-Username") String username) {
		return customerCollectionService.getCart(username);
	}

	@PostMapping
	public List<CartItemResponse> addToCart(@RequestHeader("X-Username") String username,
			@Valid @RequestBody CartItemRequest request) {
		return customerCollectionService.addToCart(username, request);
	}

	@DeleteMapping("/{productId}")
	public List<CartItemResponse> removeFromCart(@RequestHeader("X-Username") String username,
			@PathVariable Long productId) {
		return customerCollectionService.removeFromCart(username, productId);
	}
}
