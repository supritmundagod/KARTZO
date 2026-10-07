package com.m15.kartzo.api.dto;

public record PasswordUpdateRequest(
    String oldPassword,
    String newPassword,
    String confirmPassword
) {}
