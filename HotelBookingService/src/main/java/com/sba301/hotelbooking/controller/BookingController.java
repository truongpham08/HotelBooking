package com.sba301.hotelbooking.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    
    // Temporary endpoint to return empty bookings for the current user
    @GetMapping("/my-bookings")
    public ResponseEntity<List<Object>> getMyBookings() {
        return ResponseEntity.ok(new ArrayList<>());
    }
}
