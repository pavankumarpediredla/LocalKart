package com.app.commerce.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import com.app.commerce.bootstrap.AdminBootstrapProperties;

@Configuration
@EnableConfigurationProperties({ FirebaseStorageProperties.class, AdminBootstrapProperties.class })
public class AppPropertiesConfig {
}
