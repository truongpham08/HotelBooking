package com.sba301.hotelbooking.dto.request;

import com.sba301.hotelbooking.enums.BookingStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateBookingStatusRequest(
        @NotNull(message = "Status cannot be null")
        BookingStatus status
) {
}
