package com.sba301.hotelbooking.service.impl;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sba301.hotelbooking.dto.response.AdminUserDetailResponse;
import com.sba301.hotelbooking.dto.response.AdminUserResponse;
import com.sba301.hotelbooking.dto.response.BookingResponse;
import com.sba301.hotelbooking.dto.response.PageResponse;
import com.sba301.hotelbooking.entity.User;
import com.sba301.hotelbooking.repository.BookingRepository;
import com.sba301.hotelbooking.repository.RoomRepository;
import com.sba301.hotelbooking.repository.UserRepository;
import com.sba301.hotelbooking.service.AdminUserService;

import jakarta.persistence.EntityNotFoundException;

@Service
@Transactional(readOnly = true)
public class AdminUserServiceImpl implements AdminUserService {
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;

    public AdminUserServiceImpl(UserRepository userRepository, BookingRepository bookingRepository,
                                RoomRepository roomRepository) {
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
    }

    @Override
    public PageResponse<AdminUserResponse> getUsers(String keyword, Integer page, Integer size) {
        String normalizedKeyword = keyword == null || keyword.isBlank() ? null : keyword.trim();
        int pageNumber = page == null || page < 0 ? 0 : page;
        int pageSize = size == null || size <= 0 ? 10 : Math.min(size, 100);
        var users = userRepository.searchCustomers(normalizedKeyword,
                PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.DESC, "createdAt")));
        return PageResponse.from(users.map(AdminUserResponse::from));
    }

    @Override
    public AdminUserDetailResponse getUser(Long id) {
        User user = findCustomer(id);
        var bookings = bookingRepository.findByUserIdOrderByCreatedAtDesc(id).stream()
                .map(booking -> BookingResponse.from(booking,
                        roomRepository.findById(booking.getRoomId()).orElse(null)))
                .toList();
        return new AdminUserDetailResponse(AdminUserResponse.from(user), bookings);
    }

    private User findCustomer(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        if (!"USER".equalsIgnoreCase(user.getRole())) {
            throw new EntityNotFoundException("User not found with id: " + id);
        }
        return user;
    }
}
