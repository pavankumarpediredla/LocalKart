package com.app.commerce.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.commerce.dto.CheckoutRequest;
import com.app.commerce.dto.OrderItemResponse;
import com.app.commerce.dto.OrderResponse;
import com.app.commerce.entity.CartItem;
import com.app.commerce.entity.OrderItem;
import com.app.commerce.entity.OrderRecord;
import com.app.commerce.entity.OrderStatus;
import com.app.commerce.entity.Product;
import com.app.commerce.entity.User;
import com.app.commerce.repository.CartItemRepository;
import com.app.commerce.repository.OrderRecordRepository;
import com.app.commerce.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class OrderService {

	private final UserRepository userRepository;
	private final CartItemRepository cartItemRepository;
	private final OrderRecordRepository orderRecordRepository;

	public OrderService(UserRepository userRepository, CartItemRepository cartItemRepository,
			OrderRecordRepository orderRecordRepository) {
		this.userRepository = userRepository;
		this.cartItemRepository = cartItemRepository;
		this.orderRecordRepository = orderRecordRepository;
	}

	@Transactional
	public OrderResponse checkout(String username, CheckoutRequest request) {
		User user = getActiveUser(username);
		List<CartItem> cartItems = cartItemRepository.findByUserUsernameIgnoreCaseOrderByIdDesc(username);

		if (cartItems.isEmpty()) {
			throw new IllegalArgumentException("Cart is empty.");
		}

		OrderRecord order = new OrderRecord();
		order.setUser(user);
		order.setCustomerName(request.getCustomerName());
		order.setShippingAddress(request.getShippingAddress());
		order.setCity(request.getCity());
		order.setPostalCode(request.getPostalCode());
		order.setPhoneNumber(request.getPhoneNumber());
		order.setStatus(OrderStatus.PLACED);
		order.setCreatedAt(LocalDateTime.now());

		BigDecimal grandTotal = BigDecimal.ZERO;
		List<OrderItem> orderItems = new ArrayList<>();

		for (CartItem cartItem : cartItems) {
			Product product = cartItem.getProduct();

			if (product.getStockQuantity() < cartItem.getQuantity()) {
				throw new IllegalArgumentException("Insufficient stock for product: " + product.getName());
			}

			OrderItem orderItem = new OrderItem();
			orderItem.setOrder(order);
			orderItem.setProduct(product);
			orderItem.setQuantity(cartItem.getQuantity());
			orderItem.setUnitPrice(product.getPrice());
			orderItem.setLineTotal(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
			orderItems.add(orderItem);
			grandTotal = grandTotal.add(orderItem.getLineTotal());

			product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
		}

		order.setGrandTotal(grandTotal);
		order.setItems(orderItems);

		OrderRecord savedOrder = orderRecordRepository.save(order);
		cartItemRepository.deleteByUserUsernameIgnoreCase(username);
		return toResponse(savedOrder);
	}

	public List<OrderResponse> getOrders(String username) {
		validateUsername(username);
		return orderRecordRepository.findByUserUsernameIgnoreCaseOrderByCreatedAtDesc(username)
				.stream()
				.map(this::toResponse)
				.toList();
	}

	private User getActiveUser(String username) {
		validateUsername(username);
		return userRepository.findByUsernameIgnoreCaseAndActiveTrue(username)
				.orElseThrow(() -> new EntityNotFoundException("Active user not found for username: " + username));
	}

	private void validateUsername(String username) {
		if (username == null || username.isBlank()) {
			throw new IllegalArgumentException("Username is required.");
		}
	}

	private OrderResponse toResponse(OrderRecord order) {
		OrderResponse response = new OrderResponse();
		response.setId(order.getId());
		response.setCustomerName(order.getCustomerName());
		response.setShippingAddress(order.getShippingAddress());
		response.setCity(order.getCity());
		response.setPostalCode(order.getPostalCode());
		response.setPhoneNumber(order.getPhoneNumber());
		response.setGrandTotal(order.getGrandTotal());
		response.setStatus(order.getStatus().name().toLowerCase());
		response.setCreatedAt(order.getCreatedAt());
		response.setItems(order.getItems().stream().map(this::toItemResponse).toList());
		return response;
	}

	private OrderItemResponse toItemResponse(OrderItem item) {
		OrderItemResponse response = new OrderItemResponse();
		response.setProductId(item.getProduct().getId());
		response.setName(item.getProduct().getName());
		response.setImageUrl(item.getProduct().getImageUrl());
		response.setQuantity(item.getQuantity());
		response.setUnitPrice(item.getUnitPrice());
		response.setLineTotal(item.getLineTotal());
		return response;
	}
}
