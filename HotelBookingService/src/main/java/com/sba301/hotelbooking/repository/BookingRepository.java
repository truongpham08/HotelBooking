package com.sba301.hotelbooking.repository;

import com.sba301.hotelbooking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

import com.sba301.hotelbooking.enums.BookingStatus;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    @org.springframework.data.jpa.repository.Query("SELECT SUM(b.totalAmount) FROM Booking b")
    java.math.BigDecimal calculateTotalRevenue();

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    boolean existsByRoomIdAndStatusNotAndCheckInDateLessThanAndCheckOutDateGreaterThan(
            Long roomId, BookingStatus excludedStatus, LocalDate checkOut, LocalDate checkIn);
}

