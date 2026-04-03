package com.app.commerce.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.commerce.dto.LoginRequest;
import com.app.commerce.dto.LoginResponse;
import com.app.commerce.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/login")
@CrossOrigin(origins = "*")
public class LoginController {

	private final AuthService authService;

	public LoginController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping
	public ResponseEntity<LoginResponse> auth(@Valid @RequestBody LoginRequest request) {
		return authService.authenticate(request)
				.map(user -> ResponseEntity.ok(new LoginResponse("Login successful.", user.getRole().name().toLowerCase())))
				.orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
						.body(new LoginResponse("Invalid credentials", null)));
	}
}
