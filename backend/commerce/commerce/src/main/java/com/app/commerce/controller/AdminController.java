package com.app.commerce.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.commerce.dto.AdminDashboardResponse;
import com.app.commerce.dto.AdminUserCreateRequest;
import com.app.commerce.dto.AdminUserResponse;
import com.app.commerce.dto.AdminUserUpdateRequest;
import com.app.commerce.service.AdminService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

	private final AdminService adminService;

	public AdminController(AdminService adminService) {
		this.adminService = adminService;
	}

	@GetMapping("/dashboard")
	public AdminDashboardResponse getDashboard(@RequestParam String username) {
		return adminService.getDashboard(username);
	}

	@GetMapping("/users")
	public List<AdminUserResponse> getUsers(@RequestParam(required = false) String query) {
		return adminService.getUsers(query);
	}

	@PostMapping("/users")
	public ResponseEntity<AdminUserResponse> createUser(@Valid @RequestBody AdminUserCreateRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(adminService.createUser(request));
	}

	@PutMapping("/users/{userId}")
	public AdminUserResponse updateUser(@PathVariable Long userId, @Valid @RequestBody AdminUserUpdateRequest request) {
		return adminService.updateUser(userId, request);
	}
}
