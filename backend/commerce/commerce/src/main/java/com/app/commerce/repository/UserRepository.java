package com.app.commerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.app.commerce.entity.User;
import com.app.commerce.entity.UserRole;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByUsernameIgnoreCaseAndActiveTrue(String username);

	Optional<User> findByUsernameIgnoreCase(String username);

	boolean existsByUsernameIgnoreCase(String username);

	boolean existsByEmailIgnoreCase(String email);

	long countByActiveTrue();

	long countByRole(UserRole role);

	@Query("""
			select u from User u
			where lower(coalesce(u.username, '')) like lower(concat('%', :query, '%'))
			   or lower(coalesce(u.fullName, '')) like lower(concat('%', :query, '%'))
			   or lower(coalesce(u.email, '')) like lower(concat('%', :query, '%'))
			   or str(u.role) like upper(concat('%', :query, '%'))
			order by u.id desc
			""")
	List<User> search(@Param("query") String query);
}
