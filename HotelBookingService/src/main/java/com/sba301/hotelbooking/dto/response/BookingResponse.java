package com.sba301.hotelbooking.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.sba301.hotelbooking.entity.Booking;
import com.sba301.hotelbooking.enums.BookingStatus;

public record BookingResponse(
        Long id,
        String customerName,
        String customerEmail,
        String customerPhone,
        Long roomId,
        String roomName,
        LocalDate checkInDate,
        LocalDate checkOutDate,
        BigDecimal totalPrice,
        BookingStatus status,
        LocalDate date // Added for compatibility with frontend code
) {
    public static BookingResponse from(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getCustomerName(),
                booking.getCustomerEmail(),
                booking.getCustomerPhone(),
                booking.getRoom().getId(),
                booking.getRoom().getName(),
                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                booking.getTotalPrice(),
                booking.getStatus(),
                booking.getCheckInDate() // For simplified frontend display
        );
    }
}
