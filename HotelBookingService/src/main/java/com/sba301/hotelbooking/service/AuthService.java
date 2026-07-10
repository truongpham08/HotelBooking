package com.sba301.hotelbooking.service;

import com.sba301.hotelbooking.dto.request.LoginRequest;
import com.sba301.hotelbooking.dto.request.RegisterRequest;
import com.sba301.hotelbooking.dto.response.AuthResponse;
import com.sba301.hotelbooking.entity.User;
import com.sba301.hotelbooking.repository.UserRepository;
import com.sba301.hotelbooking.security.CustomUserDetails;
import com.sba301.hotelbooking.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .address(request.getAddress())
                .role("USER")
                .build();
                
        user = userRepository.save(user);
        
        String jwtToken = jwtUtils.generateToken(new CustomUserDetails(user));
        return mapToAuthResponse(user, jwtToken);
    }
    
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        String jwtToken = jwtUtils.generateToken(new CustomUserDetails(user));
        return mapToAuthResponse(user, jwtToken);
    }
    
    private AuthResponse mapToAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .role(user.getRole())
                .token(token)
                .build();
    }
}
