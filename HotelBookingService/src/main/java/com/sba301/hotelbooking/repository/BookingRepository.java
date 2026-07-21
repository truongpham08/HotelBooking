package com.sba301.hotelbooking.repository;

import com.sba301.hotelbooking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT SUM(b.totalAmount) FROM Booking b")
    java.math.BigDecimal calculateTotalRevenue();
}

