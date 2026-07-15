package com.booking.hotel.service;

import com.booking.hotel.dto.BookingDTO;
import com.booking.hotel.entity.Booking;
import com.booking.hotel.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;

    @Override
    public BookingDTO createBooking(BookingDTO dto) {
        String bookingId = dto.getId() != null ? dto.getId() : "BOOK-" + System.currentTimeMillis();

        Booking booking = Booking.builder()
                .id(bookingId)
                .roomId(dto.getRoomId())
                .roomName(dto.getRoomName())
                .pricePerNight(dto.getPricePerNight())
                .checkIn(dto.getCheckIn())
                .checkOut(dto.getCheckOut())
                .capacity(dto.getCapacity())
                .nights(dto.getNights())
                .subTotal(dto.getSubTotal())
                .serviceFee(dto.getServiceFee())
                .totalAmount(dto.getTotalAmount())
                .customerFullName(dto.getCustomer().getFullName())
                .customerEmail(dto.getCustomer().getEmail())
                .customerPhone(dto.getCustomer().getPhone())
                .paymentMethod(dto.getPaymentMethod())
                .requests(dto.getRequests())
                .createdAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : LocalDateTime.now())
                .status("CONFIRMED")
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        return mapToDTO(savedBooking);
    }

    @Override
    public BookingDTO getBookingById(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        return mapToDTO(booking);
    }

    private BookingDTO mapToDTO(Booking booking) {
        return BookingDTO.builder()
                .id(booking.getId())
                .roomId(booking.getRoomId())
                .roomName(booking.getRoomName())
                .pricePerNight(booking.getPricePerNight())
                .checkIn(booking.getCheckIn())
                .checkOut(booking.getCheckOut())
                .capacity(booking.getCapacity())
                .nights(booking.getNights())
                .subTotal(booking.getSubTotal())
                .serviceFee(booking.getServiceFee())
                .totalAmount(booking.getTotalAmount())
                .customer(BookingDTO.CustomerDTO.builder()
                        .fullName(booking.getCustomerFullName())
                        .email(booking.getCustomerEmail())
                        .phone(booking.getCustomerPhone())
                        .build())
                .paymentMethod(booking.getPaymentMethod())
                .requests(booking.getRequests())
                .createdAt(booking.getCreatedAt())
                .status(booking.getStatus())
                .build();
    }
}
