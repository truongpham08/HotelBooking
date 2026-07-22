package com.sba301.hotelbooking.dto.response;

import java.time.LocalDateTime;

import com.sba301.hotelbooking.entity.User;

public record AdminUserResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        String address,
        LocalDateTime createdAt
) {
    public static AdminUserResponse from(User user) {
        return new AdminUserResponse(user.getId(), user.getFullName(), user.getEmail(),
                user.getPhone(), user.getAddress(), user.getCreatedAt());
    }
}
