package com.app.commerce.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.app.commerce.dto.AccountInfoResponse;
import com.app.commerce.dto.AdminDashboardResponse;
import com.app.commerce.dto.AdminStatResponse;
import com.app.commerce.dto.AdminUserCreateRequest;
import com.app.commerce.dto.AdminUserResponse;
import com.app.commerce.dto.AdminUserUpdateRequest;
import com.app.commerce.dto.CustomerSegmentResponse;
import com.app.commerce.dto.SupportTicketResponse;
import com.app.commerce.entity.User;
import com.app.commerce.entity.UserRole;
import com.app.commerce.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class AdminService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public AdminService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public AdminDashboardResponse getDashboard(String username) {
		User admin = userRepository.findByUsernameIgnoreCase(username)
				.orElseThrow(() -> new EntityNotFoundException("Admin account not found."));

		long activeUsers = userRepository.countByActiveTrue();
		long customers = userRepository.countByRole(UserRole.CUSTOMER) + userRepository.countByRole(UserRole.BUYER);
		long admins = userRepository.countByRole(UserRole.ADMIN);
		long sellers = userRepository.countByRole(UserRole.SELLER);

		List<AdminStatResponse> stats = List.of(
				new AdminStatResponse("Active users", Long.toString(activeUsers), "+12 this week"),
				new AdminStatResponse("Customers", Long.toString(customers), "Live customer base"),
				new AdminStatResponse("Sellers", Long.toString(sellers), "Active storefronts"),
				new AdminStatResponse("Support tickets", "87", "12 high priority"),
				new AdminStatResponse("Admins", Long.toString(admins), "Platform operators"));

		List<SupportTicketResponse> supportTickets = List.of(
				new SupportTicketResponse("#SUP-291", "Riya Patel", "Payment retry failed", "High"),
				new SupportTicketResponse("#SUP-284", "Daniel Reed", "Order status mismatch", "Medium"),
				new SupportTicketResponse("#SUP-276", "Sara Khan", "Refund request pending", "High"));

		List<AccountInfoResponse> accountInfo = List.of(
				new AccountInfoResponse("Admin name", defaultValue(admin.getFullName(), admin.getUsername())),
				new AccountInfoResponse("Email", defaultValue(admin.getEmail(), admin.getUsername() + "@easycart.com")),
				new AccountInfoResponse("Role", admin.getRole().name()),
				new AccountInfoResponse("Username", admin.getUsername()));

		List<CustomerSegmentResponse> customerSegments = List.of(
				new CustomerSegmentResponse("Premium customers", Long.toString(Math.max(1, customers / 2)), "cyan"),
				new CustomerSegmentResponse("Inactive users", Long.toString(Math.max(0, activeUsers / 4)), "amber"),
				new CustomerSegmentResponse("Support escalations", "36", "rose"));

		return new AdminDashboardResponse(stats, supportTickets, accountInfo, customerSegments, List.of(36, 55, 62, 49, 78, 66, 88));
	}

	public List<AdminUserResponse> getUsers(String query) {
		List<User> users = StringUtils.hasText(query) ? userRepository.search(query.trim()) : userRepository.findAll();
		return users.stream().map(this::toResponse).toList();
	}

	public AdminUserResponse createUser(AdminUserCreateRequest request) {
		if (userRepository.existsByUsernameIgnoreCase(request.getUsername())) {
			throw new IllegalArgumentException("Username already exists.");
		}

		if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
			throw new IllegalArgumentException("Email already exists.");
		}

		User user = new User();
		user.setUsername(request.getUsername().trim());
		user.setFullName(request.getFullName().trim());
		user.setEmail(request.getEmail().trim().toLowerCase());
		user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
		user.setRole(request.getRole());
		user.setActive(true);

		return toResponse(userRepository.save(user));
	}

	public AdminUserResponse updateUser(Long userId, AdminUserUpdateRequest request) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new EntityNotFoundException("User not found."));

		if (StringUtils.hasText(request.getPassword()) && user.getRole() != UserRole.SELLER) {
			throw new IllegalArgumentException("Password updates are allowed only for seller accounts.");
		}

		user.setFullName(request.getFullName().trim());
		user.setEmail(request.getEmail().trim().toLowerCase());
		user.setRole(request.getRole());
		user.setActive(request.isActive());

		if (StringUtils.hasText(request.getPassword())) {
			user.setPasswordHash(passwordEncoder.encode(request.getPassword().trim()));
		}

		return toResponse(userRepository.save(user));
	}

	private AdminUserResponse toResponse(User user) {
		return new AdminUserResponse(
				user.getId(),
				user.getUsername(),
				defaultValue(user.getFullName(), user.getUsername()),
				defaultValue(user.getEmail(), user.getUsername() + "@easycart.com"),
				user.getRole().name(),
				user.isActive() ? "Active" : "Pending");
	}

	private String defaultValue(String value, String fallback) {
		return StringUtils.hasText(value) ? value : fallback;
	}
}
