package com.booking.hotel.controller;

import com.booking.hotel.dto.BookingDTO;
import com.booking.hotel.response.ApiResponse;
import com.booking.hotel.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingDTO>> createBooking(@Valid @RequestBody BookingDTO bookingDTO) {
        BookingDTO createdBooking = bookingService.createBooking(bookingDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(createdBooking, "Đặt phòng thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingDTO>> getBookingById(@PathVariable String id) {
        BookingDTO booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(ApiResponse.success(booking, "Lấy thông tin đặt phòng thành công"));
    }
}
