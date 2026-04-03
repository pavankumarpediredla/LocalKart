package com.app.commerce.bootstrap;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;

import com.app.commerce.entity.User;
import com.app.commerce.entity.UserRole;
import com.app.commerce.repository.UserRepository;

@Configuration
public class AdminBootstrapConfig {

	@Bean
	CommandLineRunner bootstrapAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder,
			AdminBootstrapProperties properties) {
		return args -> {
			if (!StringUtils.hasText(properties.getUsername()) || !StringUtils.hasText(properties.getPassword())) {
				return;
			}

			if (!userRepository.existsByUsernameIgnoreCase(properties.getUsername())) {
				User admin = new User();
				admin.setUsername(properties.getUsername());
				admin.setFullName(StringUtils.hasText(properties.getFullName()) ? properties.getFullName() : properties.getUsername());
				admin.setEmail(StringUtils.hasText(properties.getEmail()) ? properties.getEmail()
						: properties.getUsername() + "@easycart.com");
				admin.setPasswordHash(passwordEncoder.encode(properties.getPassword()));
				admin.setRole(UserRole.ADMIN);
				admin.setActive(true);
				userRepository.save(admin);
			}

			AdminBootstrapProperties.Customer customer = properties.getCustomer();
			if (customer == null || !StringUtils.hasText(customer.getUsername())
					|| !StringUtils.hasText(customer.getPassword())) {
				return;
			}

			if (userRepository.existsByUsernameIgnoreCase(customer.getUsername())) {
				return;
			}

			User customerUser = new User();
			customerUser.setUsername(customer.getUsername());
			customerUser.setFullName(StringUtils.hasText(customer.getFullName()) ? customer.getFullName() : customer.getUsername());
			customerUser.setEmail(StringUtils.hasText(customer.getEmail()) ? customer.getEmail()
					: customer.getUsername() + "@easycart.com");
			customerUser.setPasswordHash(passwordEncoder.encode(customer.getPassword()));
			customerUser.setRole(UserRole.CUSTOMER);
			customerUser.setActive(true);
			userRepository.save(customerUser);
		};
	}
}
