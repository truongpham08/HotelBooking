package com.booking.hotel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {

    private String id;
    
    @NotNull(message = "Room ID is required")
    private Long roomId;
    
    private String roomName;
    private BigDecimal pricePerNight;
    
    @NotNull(message = "Check-in date is required")
    private LocalDate checkIn;
    
    @NotNull(message = "Check-out date is required")
    private LocalDate checkOut;
    
    private Integer capacity;
    private Integer nights;
    private BigDecimal subTotal;
    private BigDecimal serviceFee;
    private BigDecimal totalAmount;
    
    @NotNull(message = "Customer information is required")
    private CustomerDTO customer;
    
    @NotBlank(message = "Payment method is required")
    private String paymentMethod;
    
    private String requests;
    private LocalDateTime createdAt;
    private String status;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerDTO {
        @NotBlank(message = "Full name is required")
        private String fullName;
        
        @NotBlank(message = "Email is required")
        private String email;
        
        @NotBlank(message = "Phone is required")
        private String phone;
    }
}
