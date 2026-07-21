package com.sba301.hotelbooking.controller;

import com.sba301.hotelbooking.dto.request.BookingStatusRequest;
import com.sba301.hotelbooking.dto.response.BookingResponse;
import com.sba301.hotelbooking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminBookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponse> updateStatus(
            @PathVariable Long id, 
            @RequestBody BookingStatusRequest request) {
        
        BookingResponse updated = bookingService.updateBookingStatus(id, request.getStatus());
        return ResponseEntity.ok(updated);
    }
}

