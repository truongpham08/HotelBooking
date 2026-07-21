package com.sba301.hotelbooking.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BookingResponse {
    private Long id;
    private String guestName;
    private String roomNumber;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private BigDecimal totalAmount;
    private String status;
}

