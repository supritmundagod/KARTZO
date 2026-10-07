package com.m15.kartzo.dao;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.m15.kartzo.entity.User;
import com.m15.kartzo.repository.UserRepository;

@Repository
@SuppressWarnings("null")
public class UserDao {
	@Autowired
	UserRepository userRepository;

	public boolean emailExists(String email) {
		return userRepository.existsByEmail(email);
	}

	public boolean mobileExists(Long mobile) {
		return userRepository.existsByMobile(mobile);
	}

	public void save(User user) {
		userRepository.save(user);
	}

	public User findById(Long id) {
		return userRepository.findById(id).orElseThrow();
	}

	public Optional<User> findByEmail(String email) {
		return userRepository.findByEmail(email);
	}

	public long countByRole(String role) {
		return userRepository.countByRole(role);
	}
}
