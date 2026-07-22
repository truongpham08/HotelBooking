package com.sba301.hotelbooking.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sba301.hotelbooking.dto.request.CreateBookingRequest;
import com.sba301.hotelbooking.dto.response.ApiResponse;
import com.sba301.hotelbooking.dto.response.BookingResponse;
import com.sba301.hotelbooking.security.CustomUserDetails;
import com.sba301.hotelbooking.service.BookingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            Authentication authentication) {
        Long userId = getAuthenticatedUserId(authentication);
        BookingResponse booking = bookingService.createBooking(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(booking, "Booking created successfully"));
    }

    @GetMapping("/{id}")
    public ApiResponse<BookingResponse> getBookingById(@PathVariable Long id) {
        return ApiResponse.success(bookingService.getBookingById(id), "Booking retrieved successfully");
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponse>> getMyBookings(Authentication authentication) {
        Long userId = getAuthenticatedUserId(authentication);
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));
    }

    private Long getAuthenticatedUserId(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails details)) return null;
        return details.getUser().getId();
    }
}
