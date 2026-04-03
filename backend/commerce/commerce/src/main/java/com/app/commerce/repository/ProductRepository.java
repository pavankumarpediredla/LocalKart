package com.app.commerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.commerce.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
