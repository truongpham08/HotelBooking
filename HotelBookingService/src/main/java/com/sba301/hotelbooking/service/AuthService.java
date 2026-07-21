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
    
    public AuthResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToAuthResponse(user, null); // no token returned for profile view
    }
    
    public AuthResponse updateProfile(String email, com.sba301.hotelbooking.dto.request.UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        
        user = userRepository.save(user);
        return mapToAuthResponse(user, null);
    }
    
    public void changePassword(String email, com.sba301.hotelbooking.dto.request.ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
                
        // Kiểm tra mật khẩu cũ
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không chính xác");
        }
        
        // Cập nhật mật khẩu mới (đã mã hóa)
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
    
    public void forgotPassword(String email) {
        if (!userRepository.existsByEmail(email)) {
            throw new RuntimeException("Không tìm thấy tài khoản với email này");
        }
        // Giả lập gửi email khôi phục thành công
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
