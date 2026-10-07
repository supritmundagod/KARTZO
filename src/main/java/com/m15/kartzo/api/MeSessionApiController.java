package com.m15.kartzo.api;

import java.security.Principal;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.m15.kartzo.api.dto.MeSessionResponse;
import com.m15.kartzo.dao.UserDao;
import com.m15.kartzo.entity.User;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/me")
@RequiredArgsConstructor
public class MeSessionApiController {

	private final UserDao userDao;

	@GetMapping("/session")
	public MeSessionResponse session(Principal principal) {
		User user = userDao.findByEmail(principal.getName()).orElseThrow();
		return new MeSessionResponse(user.getName(), user.getEmail());
	}
}
