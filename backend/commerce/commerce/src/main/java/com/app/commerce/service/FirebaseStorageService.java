package com.app.commerce.service;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.charset.StandardCharsets;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.app.commerce.config.FirebaseStorageProperties;
import com.app.commerce.config.LocalStorageProperties;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;

@Service
public class FirebaseStorageService {

	private final FirebaseStorageProperties properties;
	private final LocalStorageProperties localStorageProperties;

	public FirebaseStorageService(FirebaseStorageProperties properties, LocalStorageProperties localStorageProperties) {
		this.properties = properties;
		this.localStorageProperties = localStorageProperties;
	}

	public String uploadProductImage(MultipartFile file) throws IOException {
		if (file == null || file.isEmpty()) {
			return null;
		}

		if (properties.isEnabled()) {
			return uploadToFirebase(file);
		}

		return uploadToLocalStorage(file);
	}

	private String uploadToFirebase(MultipartFile file) throws IOException {
		String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
		String fileName = "products/" + UUID.randomUUID() + (extension != null ? "." + extension : "");

		Bucket bucket = StorageClient.getInstance().bucket();
		BlobInfo blobInfo = BlobInfo.newBuilder(bucket.getName(), fileName).setContentType(file.getContentType()).build();
		bucket.getStorage().create(blobInfo, file.getBytes());

		return "https://firebasestorage.googleapis.com/v0/b/" + bucket.getName() + "/o/"
				+ URLEncoder.encode(fileName, StandardCharsets.UTF_8) + "?alt=media";
	}

	private String uploadToLocalStorage(MultipartFile file) throws IOException {
		String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
		String fileName = UUID.randomUUID() + (extension != null ? "." + extension : "");
		Path uploadRoot = Paths.get(localStorageProperties.getUploadDir()).toAbsolutePath().normalize();
		Path productDirectory = uploadRoot.resolve("products");

		Files.createDirectories(productDirectory);

		Path targetFile = productDirectory.resolve(fileName).normalize();
		Files.copy(file.getInputStream(), targetFile, StandardCopyOption.REPLACE_EXISTING);

		return ServletUriComponentsBuilder.fromCurrentContextPath()
				.path("/uploads/products/")
				.path(fileName)
				.toUriString();
	}
}
