package com.sba301.hotelbooking.service;

import com.sba301.hotelbooking.dto.response.BookingResponse;
import com.sba301.hotelbooking.dto.request.CreateBookingRequest;
import java.util.List;

public interface BookingService {
    BookingResponse createBooking(CreateBookingRequest request, Long userId);
    BookingResponse getBookingById(String id);
    List<BookingResponse> getBookingsByUserId(Long userId);
    List<BookingResponse> getAllBookings();
    BookingResponse updateBookingStatus(String id, String status);
}

