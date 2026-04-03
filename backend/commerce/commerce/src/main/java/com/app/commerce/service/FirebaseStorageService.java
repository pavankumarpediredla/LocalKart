package com.app.commerce.service;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.app.commerce.config.FirebaseStorageProperties;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;

@Service
public class FirebaseStorageService {

	private final FirebaseStorageProperties properties;

	public FirebaseStorageService(FirebaseStorageProperties properties) {
		this.properties = properties;
	}

	public String uploadProductImage(MultipartFile file) throws IOException {
		if (file == null || file.isEmpty()) {
			return null;
		}

		if (!properties.isEnabled()) {
			throw new IllegalStateException("Firebase Storage is disabled. Set FIREBASE_ENABLED=true to upload images.");
		}

		String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
		String fileName = "products/" + UUID.randomUUID() + (extension != null ? "." + extension : "");

		Bucket bucket = StorageClient.getInstance().bucket();
		BlobInfo blobInfo = BlobInfo.newBuilder(bucket.getName(), fileName).setContentType(file.getContentType()).build();
		bucket.getStorage().create(blobInfo, file.getBytes());

		return "https://firebasestorage.googleapis.com/v0/b/" + bucket.getName() + "/o/"
				+ URLEncoder.encode(fileName, StandardCharsets.UTF_8) + "?alt=media";
	}
}
