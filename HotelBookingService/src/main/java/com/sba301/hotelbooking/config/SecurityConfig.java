package com.sba301.hotelbooking.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity // KÃ­ch hoáº¡t @PreAuthorize("hasRole('ADMIN')")
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/admin/**").permitAll() // Táº¡m thá»i permitAll Ä‘á»ƒ test khÃ´ng cáº§n JWT, khi ná»‘i JWT thÃ¬ Ä‘á»•i thÃ nh authenticated
                .anyRequest().permitAll()
            );
        return http.build();
    }
}

