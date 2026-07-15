package com.example.hotelbooking.service;

import com.example.hotelbooking.dto.response.BookingResponse;
import java.util.List;

public interface BookingService {
    List<BookingResponse> getAllBookings();
    BookingResponse updateBookingStatus(Long id, String status);
}
