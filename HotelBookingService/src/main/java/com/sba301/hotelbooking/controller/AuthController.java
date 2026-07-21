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
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(authService.getProfile(email));
    }
    
    @PutMapping("/profile")
    public ResponseEntity<AuthResponse> updateProfile(@RequestBody com.sba301.hotelbooking.dto.request.UpdateProfileRequest request) {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(authService.updateProfile(email, request));
    }
    
    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody com.sba301.hotelbooking.dto.request.ChangePasswordRequest request) {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            authService.changePassword(email, request);
            return ResponseEntity.ok().body("{\"message\": \"Đổi mật khẩu thành công\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("{\"message\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody java.util.Map<String, String> request) {
        try {
            authService.forgotPassword(request.get("email"));
            return ResponseEntity.ok().body("{\"message\": \"Đã gửi mã khôi phục đến email của bạn.\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("{\"message\": \"" + e.getMessage() + "\"}");
        }
    }
}
