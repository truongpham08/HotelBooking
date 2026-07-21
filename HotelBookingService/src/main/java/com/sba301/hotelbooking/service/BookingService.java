package com.sba301.hotelbooking.service;

import com.sba301.hotelbooking.dto.response.BookingResponse;
import java.util.List;

public interface BookingService {
    List<BookingResponse> getAllBookings();
    BookingResponse updateBookingStatus(Long id, String status);
}

