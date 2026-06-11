package com.app.commerce.dto;

import jakarta.validation.constraints.NotBlank;

public class CheckoutRequest {

	@NotBlank(message = "Customer name is required.")
	private String customerName;

	@NotBlank(message = "Shipping address is required.")
	private String shippingAddress;

	@NotBlank(message = "City is required.")
	private String city;

	@NotBlank(message = "Postal code is required.")
	private String postalCode;

	@NotBlank(message = "Phone number is required.")
	private String phoneNumber;

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public String getShippingAddress() {
		return shippingAddress;
	}

	public void setShippingAddress(String shippingAddress) {
		this.shippingAddress = shippingAddress;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getPostalCode() {
		return postalCode;
	}

	public void setPostalCode(String postalCode) {
		this.postalCode = postalCode;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}
}
