package com.app.commerce.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
	@NotBlank
	String userName;
	@NotBlank
	String password;

}
