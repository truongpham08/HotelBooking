package com.sba301.hotelbooking.component;

import com.sba301.hotelbooking.entity.User;
import com.sba301.hotelbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("admin@hotel.com")) {
            User admin = User.builder()
                    .fullName("Quản trị viên")
                    .email("admin@hotel.com")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("0987654321")
                    .address("Hà Nội")
                    .role("ADMIN")
                    .build();
            userRepository.save(admin);
            System.out.println("====== ĐÃ TẠO TÀI KHOẢN ADMIN MẶC ĐỊNH ======");
            System.out.println("Email: admin@hotel.com");
            System.out.println("Password: admin123");
            System.out.println("============================================");
        }
    }
}
