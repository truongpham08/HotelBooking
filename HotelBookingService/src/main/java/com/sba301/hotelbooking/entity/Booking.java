package com.sba301.hotelbooking.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import com.sba301.hotelbooking.enums.BookingStatus;

@Entity
@Table(name = "bookings")
@Data
public class Booking {
    @Id
    private String id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "room_id")
    private Long roomId;

    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    
    private BigDecimal totalAmount;

    private Integer capacity;
    private Integer nights;
    private BigDecimal pricePerNight;
    private BigDecimal subTotal;
    private BigDecimal serviceFee;
    @Column(columnDefinition = "nvarchar(255)")
    private String customerFullName;
    private String customerEmail;
    private String customerPhone;
    private String paymentMethod;

    @Column(columnDefinition = "nvarchar(max)")
    private String requests;

    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    @PrePersist
    void prePersist() {
        if (id == null) id = "BOOK-" + UUID.randomUUID();
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (status == null) status = BookingStatus.PENDING;
    }
}

