package com.app.commerce.config;

import java.io.FileInputStream;
import java.io.IOException;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

@Configuration
@ConditionalOnProperty(prefix = "app.firebase", name = "enabled", havingValue = "true")
public class FirebaseConfig {

	@Bean
	FirebaseApp firebaseApp(FirebaseStorageProperties properties) throws IOException {
		if (!StringUtils.hasText(properties.getCredentialsPath())) {
			throw new IllegalStateException("Firebase is enabled but app.firebase.credentials-path is not configured.");
		}

		if (!StringUtils.hasText(properties.getBucketName())) {
			throw new IllegalStateException("Firebase is enabled but app.firebase.bucket-name is not configured.");
		}

		if (!FirebaseApp.getApps().isEmpty()) {
			return FirebaseApp.getInstance();
		}

		try (FileInputStream serviceAccount = new FileInputStream(properties.getCredentialsPath())) {
			FirebaseOptions options = FirebaseOptions.builder()
					.setCredentials(GoogleCredentials.fromStream(serviceAccount))
					.setStorageBucket(properties.getBucketName())
					.build();

			return FirebaseApp.initializeApp(options);
		}
	}
}
