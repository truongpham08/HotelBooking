package com.sba301.hotelbooking.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.sba301.hotelbooking.dto.request.CreateBookingRequest;
import com.sba301.hotelbooking.dto.response.BookingResponse;
import com.sba301.hotelbooking.entity.Booking;
import com.sba301.hotelbooking.entity.Room;
import com.sba301.hotelbooking.enums.BookingStatus;
import com.sba301.hotelbooking.repository.BookingRepository;
import com.sba301.hotelbooking.repository.RoomRepository;
import com.sba301.hotelbooking.service.impl.BookingServiceImpl;

class BookingServiceImplTests {
    private BookingRepository bookingRepository;
    private RoomRepository roomRepository;
    private BookingServiceImpl service;
    private Room room;

    @BeforeEach
    void setUp() {
        bookingRepository = mock(BookingRepository.class);
        roomRepository = mock(RoomRepository.class);
        service = new BookingServiceImpl(bookingRepository, roomRepository);
        room = mock(Room.class);
        when(room.getId()).thenReturn(10L);
        when(room.getName()).thenReturn("Deluxe");
        when(room.getAvailable()).thenReturn(true);
        when(room.getCapacity()).thenReturn(2);
        when(room.getPricePerNight()).thenReturn(new BigDecimal("1000000"));
        when(roomRepository.findById(10L)).thenReturn(Optional.of(room));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking booking = invocation.getArgument(0);
            booking.setId(1L);
            return booking;
        });
    }

    @Test
    void createsBookingAndCalculatesServerSideTotal() {
        LocalDate checkIn = LocalDate.now().plusDays(1);
        CreateBookingRequest request = request(checkIn, checkIn.plusDays(2), 2);

        BookingResponse response = service.createBooking(request, 7L);

        assertEquals(2, response.nights());
        assertEquals(new BigDecimal("2160000.00"), response.totalAmount());
        assertEquals("APPROVED", response.status());
        assertEquals("Deluxe", response.roomName());
    }

    @Test
    void rejectsCapacityAboveRoomLimit() {
        LocalDate checkIn = LocalDate.now().plusDays(1);
        assertThrows(IllegalArgumentException.class,
                () -> service.createBooking(request(checkIn, checkIn.plusDays(1), 3), null));
    }

    @Test
    void rejectsOverlappingBooking() {
        LocalDate checkIn = LocalDate.now().plusDays(1);
        when(bookingRepository.existsByRoomIdAndStatusNotAndCheckInDateLessThanAndCheckOutDateGreaterThan(
                10L, BookingStatus.CANCELLED, checkIn.plusDays(1), checkIn)).thenReturn(true);
        assertThrows(IllegalStateException.class,
                () -> service.createBooking(request(checkIn, checkIn.plusDays(1), 1), null));
    }

    private CreateBookingRequest request(LocalDate checkIn, LocalDate checkOut, int capacity) {
        return new CreateBookingRequest(10L, checkIn, checkOut, capacity,
                new CreateBookingRequest.Customer("Test User", "test@example.com", "0900000000"),
                "cash", null, null);
    }
}
