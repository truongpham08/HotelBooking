package com.sba301.hotelbooking.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sba301.hotelbooking.dto.request.UpdateBookingStatusRequest;
import com.sba301.hotelbooking.dto.response.BookingResponse;
import com.sba301.hotelbooking.dto.response.DashboardStatsResponse;
import com.sba301.hotelbooking.service.AdminBookingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
public class AdminBookingController {

    private final AdminBookingService adminBookingService;

    public AdminBookingController(AdminBookingService adminBookingService) {
        this.adminBookingService = adminBookingService;
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        return ResponseEntity.ok(adminBookingService.getDashboardStats());
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(adminBookingService.getAllBookings());
    }

    @PutMapping("/bookings/{id}/status")
    public ResponseEntity<BookingResponse> updateBookingStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateBookingStatusRequest request) {
        return ResponseEntity.ok(adminBookingService.updateBookingStatus(id, request));
    }
}
