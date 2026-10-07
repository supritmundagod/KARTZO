package com.m15.kartzo.api.dto;

public record ProfileResponse(
    String name,
    String email,
    Long mobile
) {}
