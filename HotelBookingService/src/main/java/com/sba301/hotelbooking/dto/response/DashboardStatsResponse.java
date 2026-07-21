package com.sba301.hotelbooking.dto.response;

import java.math.BigDecimal;

public record DashboardStatsResponse(
        BigDecimal totalRevenue,
        Long totalBookings,
        Long availableRooms
) {
}
