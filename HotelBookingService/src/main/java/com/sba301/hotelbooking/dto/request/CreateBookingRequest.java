package com.sba301.hotelbooking.dto.request;

import java.time.LocalDate;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateBookingRequest(
        @NotNull Long roomId,
        @NotNull LocalDate checkIn,
        @NotNull LocalDate checkOut,
        @NotNull @Min(1) Integer capacity,
        @NotNull @Valid Customer customer,
        @NotBlank String paymentMethod,
        String requests,
        String status
) {
    public record Customer(
            @NotBlank String fullName,
            @NotBlank @Email String email,
            @NotBlank String phone
    ) {
    }
}
