package com.m15.kartzo.api;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.m15.kartzo.api.dto.PasswordUpdateRequest;
import com.m15.kartzo.api.dto.ProfileResponse;
import com.m15.kartzo.api.dto.ProfileUpdateRequest;
import com.m15.kartzo.dao.UserDao;
import com.m15.kartzo.entity.User;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/me/profile")
@RequiredArgsConstructor
public class MeProfileApiController {

    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public ProfileResponse getProfile(Principal principal) {
        User user = userDao.findByEmail(principal.getName()).orElseThrow();
        return new ProfileResponse(user.getName(), user.getEmail(), user.getMobile());
    }

    @PutMapping
    public ProfileResponse updateProfile(@RequestBody ProfileUpdateRequest request, Principal principal) {
        User user = userDao.findByEmail(principal.getName()).orElseThrow();
        user.setName(request.name());
        user.setMobile(request.mobile());
        userDao.save(user);
        return new ProfileResponse(user.getName(), user.getEmail(), user.getMobile());
    }

    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(@RequestBody PasswordUpdateRequest request, Principal principal) {
        User user = userDao.findByEmail(principal.getName()).orElseThrow();

        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Incorrect old password");
        }

        if (!request.newPassword().equals(request.confirmPassword())) {
            return ResponseEntity.badRequest().body("Passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userDao.save(user);
        return ResponseEntity.ok("Password updated successfully");
    }
}
