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

import com.app.commerce.dto.WishlistItemRequest;
import com.app.commerce.dto.WishlistItemResponse;
import com.app.commerce.service.CustomerCollectionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {

	private final CustomerCollectionService customerCollectionService;

	public WishlistController(CustomerCollectionService customerCollectionService) {
		this.customerCollectionService = customerCollectionService;
	}

	@GetMapping
	public List<WishlistItemResponse> getWishlist(@RequestHeader("X-Username") String username) {
		return customerCollectionService.getWishlist(username);
	}

	@PostMapping
	public List<WishlistItemResponse> addToWishlist(@RequestHeader("X-Username") String username,
			@Valid @RequestBody WishlistItemRequest request) {
		return customerCollectionService.addToWishlist(username, request);
	}

	@DeleteMapping("/{productId}")
	public List<WishlistItemResponse> removeFromWishlist(@RequestHeader("X-Username") String username,
			@PathVariable Long productId) {
		return customerCollectionService.removeFromWishlist(username, productId);
	}
}
