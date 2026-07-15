package com.booking.hotel.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @Column(name = "id", nullable = false, length = 50)
    private String id; // Format: BOOK-{timestamp}

    @Column(name = "room_id", nullable = false)
    private Long roomId;

    @Column(name = "room_name")
    private String roomName;

    @Column(name = "price_per_night")
    private BigDecimal pricePerNight;

    @Column(name = "check_in")
    private LocalDate checkIn;

    @Column(name = "check_out")
    private LocalDate checkOut;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "nights")
    private Integer nights;

    @Column(name = "sub_total")
    private BigDecimal subTotal;

    @Column(name = "service_fee")
    private BigDecimal serviceFee;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Column(name = "customer_name")
    private String customerFullName;

    @Column(name = "customer_email")
    private String customerEmail;

    @Column(name = "customer_phone")
    private String customerPhone;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "requests", columnDefinition = "TEXT")
    private String requests;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "status", length = 20)
    private String status; // PENDING, CONFIRMED, CANCELLED

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = "CONFIRMED"; // Based on simple UI flow, directly confirmed
        }
    }
}
