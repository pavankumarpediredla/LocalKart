package com.app.commerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.commerce.entity.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

	List<CartItem> findByUserUsernameIgnoreCaseOrderByIdDesc(String username);

	Optional<CartItem> findByUserUsernameIgnoreCaseAndProductId(String username, Long productId);

	void deleteByUserUsernameIgnoreCaseAndProductId(String username, Long productId);

	void deleteByUserUsernameIgnoreCase(String username);
}
