package com.app.commerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.commerce.entity.OrderRecord;

public interface OrderRecordRepository extends JpaRepository<OrderRecord, Long> {

	List<OrderRecord> findByUserUsernameIgnoreCaseOrderByCreatedAtDesc(String username);
}
