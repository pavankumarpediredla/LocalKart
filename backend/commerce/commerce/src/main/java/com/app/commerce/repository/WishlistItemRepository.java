package com.app.commerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.commerce.entity.WishlistItem;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {

	List<WishlistItem> findByUserUsernameIgnoreCaseOrderByIdDesc(String username);

	Optional<WishlistItem> findByUserUsernameIgnoreCaseAndProductId(String username, Long productId);

	void deleteByUserUsernameIgnoreCaseAndProductId(String username, Long productId);
}
