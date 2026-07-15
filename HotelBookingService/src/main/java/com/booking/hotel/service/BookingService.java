package com.booking.hotel.service;

import com.booking.hotel.dto.BookingDTO;

public interface BookingService {
    BookingDTO createBooking(BookingDTO bookingDTO);
    BookingDTO getBookingById(String id);
}
