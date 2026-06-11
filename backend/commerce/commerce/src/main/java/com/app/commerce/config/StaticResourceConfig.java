package com.app.commerce.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

	private final LocalStorageProperties localStorageProperties;

	public StaticResourceConfig(LocalStorageProperties localStorageProperties) {
		this.localStorageProperties = localStorageProperties;
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		Path uploadPath = Paths.get(localStorageProperties.getUploadDir()).toAbsolutePath().normalize();
		registry.addResourceHandler("/uploads/**")
				.addResourceLocations(uploadPath.toUri().toString());
	}
}
