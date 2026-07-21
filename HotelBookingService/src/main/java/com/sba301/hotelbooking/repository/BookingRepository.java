package com.sba301.hotelbooking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.sba301.hotelbooking.entity.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    @Query("SELECT SUM(b.totalPrice) FROM Booking b WHERE b.status = 'COMPLETED' OR b.status = 'APPROVED'")
    java.math.BigDecimal calculateTotalRevenue();
}
