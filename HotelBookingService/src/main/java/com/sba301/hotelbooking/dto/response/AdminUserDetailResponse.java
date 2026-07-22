package com.sba301.hotelbooking.dto.response;

import java.util.List;

public record AdminUserDetailResponse(
        AdminUserResponse user,
        List<BookingResponse> bookings
) {
}
