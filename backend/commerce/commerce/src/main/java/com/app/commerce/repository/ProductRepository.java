package com.app.commerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.commerce.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

	List<Product> findTop4ByCategoryIgnoreCaseAndIdNotOrderByIdDesc(String category, Long id);
}
