package com.app.commerce.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.app.commerce.dto.LoginRequest;
import com.app.commerce.entity.User;
import com.app.commerce.repository.UserRepository;

@Service
public class AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public Optional<User> authenticate(LoginRequest request) {
		return userRepository.findByUsernameIgnoreCaseAndActiveTrue(request.getUserName())
				.filter(user -> passwordEncoder.matches(request.getPassword(), user.getPasswordHash()));
	}
}
