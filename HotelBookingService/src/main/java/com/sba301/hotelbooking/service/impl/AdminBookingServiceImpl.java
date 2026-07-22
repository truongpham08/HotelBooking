package com.sba301.hotelbooking.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import com.sba301.hotelbooking.enums.BookingStatus;
import com.sba301.hotelbooking.entity.Room;

import com.sba301.hotelbooking.service.AdminBookingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sba301.hotelbooking.dto.request.UpdateBookingStatusRequest;
import com.sba301.hotelbooking.dto.response.BookingResponse;
import com.sba301.hotelbooking.dto.response.DashboardStatsResponse;
import com.sba301.hotelbooking.entity.Booking;
import com.sba301.hotelbooking.repository.BookingRepository;
import com.sba301.hotelbooking.repository.RoomRepository;

@Service
public class AdminBookingServiceImpl implements AdminBookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;

    public AdminBookingServiceImpl(BookingRepository bookingRepository, RoomRepository roomRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(BookingResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BookingResponse updateBookingStatus(Long id, UpdateBookingStatusRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        
        booking.setStatus(request.status());
        booking = bookingRepository.save(booking);
        
        return BookingResponse.from(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        BigDecimal totalRevenue = bookingRepository.calculateTotalRevenue();
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }
        
        long totalBookings = bookingRepository.count();
        
        List<Room> activeRooms = roomRepository.findAll().stream()
                .filter(room -> Boolean.TRUE.equals(room.getAvailable()))
                .collect(Collectors.toList());
                
        LocalDate today = LocalDate.now();
        long occupiedRoomsToday = activeRooms.stream()
                .filter(room -> bookingRepository.existsByRoomIdAndStatusNotAndCheckInDateLessThanAndCheckOutDateGreaterThan(
                        room.getId(), BookingStatus.CANCELLED, today.plusDays(1), today))
                .count();
                
        long availableRooms = activeRooms.size() - occupiedRoomsToday;
                
        return new DashboardStatsResponse(totalRevenue, totalBookings, availableRooms);
    }
}
