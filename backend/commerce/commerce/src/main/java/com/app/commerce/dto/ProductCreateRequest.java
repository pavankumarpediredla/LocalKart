package com.app.commerce.dto;

import java.math.BigDecimal;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ProductCreateRequest {

	@NotBlank(message = "Product name is required.")
	private String name;

	@NotBlank(message = "Description is required.")
	private String description;

	@NotBlank(message = "Category is required.")
	private String category;

	@NotNull(message = "Price is required.")
	@DecimalMin(value = "0.0", message = "Price must be zero or greater.")
	private BigDecimal price;

	@NotNull(message = "Stock quantity is required.")
	@Min(value = 0, message = "Stock quantity must be zero or greater.")
	private Integer stockQuantity;

	private MultipartFile image;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public Integer getStockQuantity() {
		return stockQuantity;
	}

	public void setStockQuantity(Integer stockQuantity) {
		this.stockQuantity = stockQuantity;
	}

	public MultipartFile getImage() {
		return image;
	}

	public void setImage(MultipartFile image) {
		this.image = image;
	}
}
