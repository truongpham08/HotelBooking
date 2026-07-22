package com.sba301.hotelbooking.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.sba301.hotelbooking.entity.Booking;
import com.sba301.hotelbooking.entity.Room;

public record BookingResponse(
        String id,
        Long roomId,
        String roomName,
        String roomNumber,
        BigDecimal pricePerNight,
        LocalDate checkIn,
        LocalDate checkOut,
        LocalDate checkInDate,
        LocalDate checkOutDate,
        Integer capacity,
        Integer nights,
        BigDecimal subTotal,
        BigDecimal serviceFee,
        BigDecimal totalAmount,
        BigDecimal totalPrice,
        CustomerResponse customer,
        String guestName,
        String paymentMethod,
        String requests,
        LocalDateTime createdAt,
        String status
) {
    public record CustomerResponse(String fullName, String email, String phone) {
    }

    public static BookingResponse from(Booking booking) {
        return from(booking, null);
    }

    public static BookingResponse from(Booking booking, Room room) {
        if (booking == null) return null;
        String roomName = room == null ? "Room " + booking.getRoomId() : room.getName();
        String guestName = booking.getCustomerFullName() == null
                ? "User " + booking.getUserId()
                : booking.getCustomerFullName();
        return new BookingResponse(
                String.valueOf(booking.getId()), booking.getRoomId(), roomName, roomName,
                booking.getPricePerNight(), booking.getCheckInDate(), booking.getCheckOutDate(),
                booking.getCheckInDate(), booking.getCheckOutDate(), booking.getCapacity(), booking.getNights(),
                booking.getSubTotal(), booking.getServiceFee(), booking.getTotalAmount(), booking.getTotalAmount(),
                new CustomerResponse(booking.getCustomerFullName(), booking.getCustomerEmail(), booking.getCustomerPhone()),
                guestName, booking.getPaymentMethod(), booking.getRequests(), booking.getCreatedAt(),
                booking.getStatus() == null ? null : booking.getStatus().name());
    }
}
