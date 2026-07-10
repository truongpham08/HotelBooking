package com.sba301.hotelbooking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String role;
    private String token; // For simplicity, we can return a dummy token or standard JWT if implemented later
}
