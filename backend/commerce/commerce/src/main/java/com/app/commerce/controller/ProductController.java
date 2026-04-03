package com.app.commerce.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.commerce.dto.ProductCreateRequest;
import com.app.commerce.entity.Product;
import com.app.commerce.service.ProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

	private final ProductService productService;

	public ProductController(ProductService productService) {
		this.productService = productService;
	}

	@GetMapping
	public List<Product> getProducts() {
		return productService.findAll();
	}

	@PostMapping
	public ResponseEntity<Product> createProduct(@Valid @ModelAttribute ProductCreateRequest request) throws IOException {
		Product product = productService.createProduct(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(product);
	}
}
