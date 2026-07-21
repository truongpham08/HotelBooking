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

    public static BookingResponse from(com.sba301.hotelbooking.entity.Booking booking) {
        if (booking == null) return null;
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setGuestName(booking.getUserId() != null ? "User " + booking.getUserId() : "Unknown");
        response.setRoomNumber(booking.getRoomId() != null ? "Room " + booking.getRoomId() : "Unknown");
        response.setCheckInDate(booking.getCheckInDate());
        response.setCheckOutDate(booking.getCheckOutDate());
        response.setTotalAmount(booking.getTotalAmount());
        response.setStatus(booking.getStatus() != null ? booking.getStatus().name() : null);
        return response;
    }
}

