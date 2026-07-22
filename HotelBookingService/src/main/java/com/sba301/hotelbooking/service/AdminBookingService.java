package com.sba301.hotelbooking.service;

import java.util.List;

import com.sba301.hotelbooking.dto.request.UpdateBookingStatusRequest;
import com.sba301.hotelbooking.dto.response.BookingResponse;
import com.sba301.hotelbooking.dto.response.DashboardStatsResponse;

public interface AdminBookingService {
    List<BookingResponse> getAllBookings();
    BookingResponse updateBookingStatus(Long id, UpdateBookingStatusRequest request);
    DashboardStatsResponse getDashboardStats();
}
