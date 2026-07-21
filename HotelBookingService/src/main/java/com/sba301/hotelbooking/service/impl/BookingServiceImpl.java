package com.sba301.hotelbooking.service.impl;

import com.sba301.hotelbooking.dto.response.BookingResponse;
import com.sba301.hotelbooking.entity.Booking;
import com.sba301.hotelbooking.enums.BookingStatus;
import com.sba301.hotelbooking.repository.BookingRepository;
import com.sba301.hotelbooking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public List<BookingResponse> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        return bookings.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public BookingResponse updateBookingStatus(Long id, String statusStr) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        try {
            BookingStatus newStatus = BookingStatus.valueOf(statusStr.toUpperCase());
            booking.setStatus(newStatus);
            Booking updatedBooking = bookingRepository.save(booking);
            return mapToResponse(updatedBooking);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status");
        }
    }

    private BookingResponse mapToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setCheckInDate(booking.getCheckInDate());
        response.setCheckOutDate(booking.getCheckOutDate());
        response.setTotalAmount(booking.getTotalAmount());
        if (booking.getStatus() != null) {
            response.setStatus(booking.getStatus().name());
        }
        
        response.setGuestName("Guest " + booking.getUserId()); 
        response.setRoomNumber("Room " + booking.getRoomId());
        
        return response;
    }
}

