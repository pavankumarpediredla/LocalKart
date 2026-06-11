package com.app.commerce.service;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;

import com.app.commerce.dto.ProductCreateRequest;
import com.app.commerce.entity.Product;
import com.app.commerce.repository.ProductRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ProductService {

	private final ProductRepository productRepository;
	private final FirebaseStorageService firebaseStorageService;

	public ProductService(ProductRepository productRepository, FirebaseStorageService firebaseStorageService) {
		this.productRepository = productRepository;
		this.firebaseStorageService = firebaseStorageService;
	}

	public List<Product> findAll() {
		return productRepository.findAll();
	}

	public Product findById(Long id) {
		return productRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Product not found for id: " + id));
	}

	public List<Product> findRelatedProducts(Long id) {
		Product product = findById(id);
		return productRepository.findTop4ByCategoryIgnoreCaseAndIdNotOrderByIdDesc(product.getCategory(), id);
	}

	public Product createProduct(ProductCreateRequest request) throws IOException {
		Product product = new Product();
		product.setName(request.getName());
		product.setDescription(request.getDescription());
		product.setCategory(request.getCategory());
		product.setPrice(request.getPrice());
		product.setStockQuantity(request.getStockQuantity());
		product.setImageUrl(firebaseStorageService.uploadProductImage(request.getImage()));
		return productRepository.save(product);
	}
}
