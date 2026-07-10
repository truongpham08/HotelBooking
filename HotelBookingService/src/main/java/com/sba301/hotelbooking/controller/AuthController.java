package com.sba301.hotelbooking.controller;

import com.sba301.hotelbooking.dto.request.LoginRequest;
import com.sba301.hotelbooking.dto.request.RegisterRequest;
import com.sba301.hotelbooking.dto.response.AuthResponse;
import com.sba301.hotelbooking.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
    
    @GetMapping("/profile")
    public ResponseEntity<AuthResponse> getProfile() {
        // Return dummy profile data or parse token
        return ResponseEntity.ok(AuthResponse.builder()
                .id(1L)
                .fullName("User Profile")
                .email("user@example.com")
                .phone("0123456789")
                .role("USER")
                .build());
    }
}
