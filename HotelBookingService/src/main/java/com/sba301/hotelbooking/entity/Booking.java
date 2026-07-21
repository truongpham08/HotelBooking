package com.sba301.hotelbooking.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import com.sba301.hotelbooking.enums.BookingStatus;

@Entity
@Table(name = "bookings")
@Data
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "room_id")
    private Long roomId;

    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;
}

