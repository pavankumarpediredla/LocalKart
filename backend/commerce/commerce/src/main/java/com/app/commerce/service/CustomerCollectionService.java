package com.app.commerce.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.app.commerce.dto.CartItemRequest;
import com.app.commerce.dto.CartItemResponse;
import com.app.commerce.dto.WishlistItemRequest;
import com.app.commerce.dto.WishlistItemResponse;
import com.app.commerce.entity.CartItem;
import com.app.commerce.entity.Product;
import com.app.commerce.entity.User;
import com.app.commerce.entity.WishlistItem;
import com.app.commerce.repository.CartItemRepository;
import com.app.commerce.repository.ProductRepository;
import com.app.commerce.repository.UserRepository;
import com.app.commerce.repository.WishlistItemRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class CustomerCollectionService {

	private final UserRepository userRepository;
	private final ProductRepository productRepository;
	private final CartItemRepository cartItemRepository;
	private final WishlistItemRepository wishlistItemRepository;

	public CustomerCollectionService(UserRepository userRepository, ProductRepository productRepository,
			CartItemRepository cartItemRepository, WishlistItemRepository wishlistItemRepository) {
		this.userRepository = userRepository;
		this.productRepository = productRepository;
		this.cartItemRepository = cartItemRepository;
		this.wishlistItemRepository = wishlistItemRepository;
	}

	public List<CartItemResponse> getCart(String username) {
		validateUsername(username);
		return cartItemRepository.findByUserUsernameIgnoreCaseOrderByIdDesc(username)
				.stream()
				.map(this::toCartResponse)
				.toList();
	}

	public List<WishlistItemResponse> getWishlist(String username) {
		validateUsername(username);
		return wishlistItemRepository.findByUserUsernameIgnoreCaseOrderByIdDesc(username)
				.stream()
				.map(this::toWishlistResponse)
				.toList();
	}

	public List<CartItemResponse> addToCart(String username, CartItemRequest request) {
		User user = getActiveUser(username);
		Product product = getProduct(request.getProductId());
		CartItem cartItem = cartItemRepository.findByUserUsernameIgnoreCaseAndProductId(username, request.getProductId())
				.orElseGet(() -> {
					CartItem item = new CartItem();
					item.setUser(user);
					item.setProduct(product);
					return item;
				});

		cartItem.setQuantity(request.getQuantity());
		cartItemRepository.save(cartItem);
		return getCart(username);
	}

	public List<CartItemResponse> removeFromCart(String username, Long productId) {
		validateUsername(username);
		cartItemRepository.deleteByUserUsernameIgnoreCaseAndProductId(username, productId);
		return getCart(username);
	}

	public List<WishlistItemResponse> addToWishlist(String username, WishlistItemRequest request) {
		User user = getActiveUser(username);
		Product product = getProduct(request.getProductId());

		if (wishlistItemRepository.findByUserUsernameIgnoreCaseAndProductId(username, request.getProductId()).isEmpty()) {
			WishlistItem item = new WishlistItem();
			item.setUser(user);
			item.setProduct(product);
			wishlistItemRepository.save(item);
		}

		return getWishlist(username);
	}

	public List<WishlistItemResponse> removeFromWishlist(String username, Long productId) {
		validateUsername(username);
		wishlistItemRepository.deleteByUserUsernameIgnoreCaseAndProductId(username, productId);
		return getWishlist(username);
	}

	private User getActiveUser(String username) {
		validateUsername(username);
		return userRepository.findByUsernameIgnoreCaseAndActiveTrue(username)
				.orElseThrow(() -> new EntityNotFoundException("Active user not found for username: " + username));
	}

	private Product getProduct(Long productId) {
		return productRepository.findById(productId)
				.orElseThrow(() -> new EntityNotFoundException("Product not found for id: " + productId));
	}

	private void validateUsername(String username) {
		if (username == null || username.isBlank()) {
			throw new IllegalArgumentException("Username is required.");
		}
	}

	private CartItemResponse toCartResponse(CartItem cartItem) {
		Product product = cartItem.getProduct();
		CartItemResponse response = new CartItemResponse();
		response.setProductId(product.getId());
		response.setName(product.getName());
		response.setDescription(product.getDescription());
		response.setCategory(product.getCategory());
		response.setPrice(product.getPrice());
		response.setStockQuantity(product.getStockQuantity());
		response.setImageUrl(product.getImageUrl());
		response.setQuantity(cartItem.getQuantity());
		response.setLineTotal(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
		return response;
	}

	private WishlistItemResponse toWishlistResponse(WishlistItem wishlistItem) {
		Product product = wishlistItem.getProduct();
		WishlistItemResponse response = new WishlistItemResponse();
		response.setProductId(product.getId());
		response.setName(product.getName());
		response.setDescription(product.getDescription());
		response.setCategory(product.getCategory());
		response.setPrice(product.getPrice());
		response.setStockQuantity(product.getStockQuantity());
		response.setImageUrl(product.getImageUrl());
		return response;
	}
}
