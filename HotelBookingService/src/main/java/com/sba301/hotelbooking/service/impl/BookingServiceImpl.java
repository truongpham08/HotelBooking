package com.sba301.hotelbooking.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sba301.hotelbooking.dto.request.CreateBookingRequest;
import com.sba301.hotelbooking.dto.response.BookingResponse;
import com.sba301.hotelbooking.entity.Booking;
import com.sba301.hotelbooking.entity.Room;
import com.sba301.hotelbooking.enums.BookingStatus;
import com.sba301.hotelbooking.repository.BookingRepository;
import com.sba301.hotelbooking.repository.RoomRepository;
import com.sba301.hotelbooking.service.BookingService;

import jakarta.persistence.EntityNotFoundException;

@Service
@Transactional(readOnly = true)
public class BookingServiceImpl implements BookingService {
    private static final BigDecimal SERVICE_FEE_RATE = new BigDecimal("0.08");

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;

    public BookingServiceImpl(BookingRepository bookingRepository, RoomRepository roomRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
    }

    @Override
    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request, Long userId) {
        Room room = roomRepository.findById(request.roomId())
                .orElseThrow(() -> new EntityNotFoundException("Room not found with id: " + request.roomId()));
        validateRequest(request, room);

        if (bookingRepository.existsByRoomIdAndStatusNotAndCheckInDateLessThanAndCheckOutDateGreaterThan(
                room.getId(), BookingStatus.CANCELLED, request.checkOut(), request.checkIn())) {
            throw new IllegalStateException("Room is already booked for the selected dates");
        }

        int nights = Math.toIntExact(ChronoUnit.DAYS.between(request.checkIn(), request.checkOut()));
        BigDecimal subTotal = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));
        BigDecimal serviceFee = subTotal.multiply(SERVICE_FEE_RATE).setScale(2, RoundingMode.HALF_UP);

        Booking booking = new Booking();
        booking.setUserId(userId);
        booking.setRoomId(room.getId());
        booking.setCheckInDate(request.checkIn());
        booking.setCheckOutDate(request.checkOut());
        booking.setCapacity(request.capacity());
        booking.setNights(nights);
        booking.setPricePerNight(room.getPricePerNight());
        booking.setSubTotal(subTotal);
        booking.setServiceFee(serviceFee);
        booking.setTotalAmount(subTotal.add(serviceFee));
        booking.setCustomerFullName(request.customer().fullName());
        booking.setCustomerEmail(request.customer().email());
        booking.setCustomerPhone(request.customer().phone());
        booking.setPaymentMethod(request.paymentMethod());
        booking.setRequests(request.requests());
        booking.setStatus(BookingStatus.PENDING);
        return BookingResponse.from(bookingRepository.save(booking), room);
    }

    private void validateRequest(CreateBookingRequest request, Room room) {
        if (!Boolean.TRUE.equals(room.getAvailable())) throw new IllegalStateException("Room is not available");
        if (request.checkIn().isBefore(LocalDate.now())) throw new IllegalArgumentException("Check-in date cannot be in the past");
        if (!request.checkOut().isAfter(request.checkIn())) throw new IllegalArgumentException("Check-out date must be after check-in date");
        if (request.capacity() > room.getCapacity()) throw new IllegalArgumentException("Room capacity is limited to " + room.getCapacity() + " guests");
    }

    @Override
    public BookingResponse getBookingById(String id) {
        Booking booking = findBooking(id);
        return BookingResponse.from(booking, roomRepository.findById(booking.getRoomId()).orElse(null));
    }

    @Override
    public List<BookingResponse> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId).stream().map(this::mapToResponse).toList();
    }

    @Override
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream().map(this::mapToResponse).toList();
    }

    @Override
    @Transactional
    public BookingResponse updateBookingStatus(String id, String status) {
        Booking booking = findBooking(id);
        try {
            booking.setStatus(BookingStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException("Invalid booking status: " + status);
        }
        return mapToResponse(bookingRepository.save(booking));
    }

    private Booking findBooking(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found with id: " + id));
    }

    private BookingResponse mapToResponse(Booking booking) {
        return BookingResponse.from(booking, roomRepository.findById(booking.getRoomId()).orElse(null));
    }
}
