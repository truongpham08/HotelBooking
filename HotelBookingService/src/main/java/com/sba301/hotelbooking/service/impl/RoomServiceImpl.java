package com.sba301.hotelbooking.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sba301.hotelbooking.dto.request.RoomRequest;
import com.sba301.hotelbooking.dto.response.PageResponse;
import com.sba301.hotelbooking.dto.response.RoomResponse;
import com.sba301.hotelbooking.dto.response.RoomTypeResponse;
import com.sba301.hotelbooking.entity.Room;
import com.sba301.hotelbooking.enums.RoomType;
import com.sba301.hotelbooking.repository.RoomRepository;
import com.sba301.hotelbooking.service.RoomService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;

@Service
@Transactional(readOnly = true)
public class RoomServiceImpl implements RoomService {

    private static final int DEFAULT_PAGE_SIZE = 6;
    private static final int MAX_PAGE_SIZE = 100;

    private final RoomRepository roomRepository;

    public RoomServiceImpl(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Override
    public PageResponse<RoomResponse> getRooms(
            String keyword,
            RoomType roomType,
            Integer capacity,
            Boolean available,
            Boolean featured,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String sortBy,
            Integer page,
            Integer size
    ) {
        int pageNumber = page == null || page < 0 ? 0 : page;
        int pageSize = size == null || size <= 0 ? DEFAULT_PAGE_SIZE : Math.min(size, MAX_PAGE_SIZE);
        Pageable pageable = PageRequest.of(pageNumber, pageSize, resolveSort(sortBy));

        return PageResponse.from(roomRepository.findAll(
                        buildSpecification(keyword, roomType, capacity, available, featured, minPrice, maxPrice),
                        pageable
                )
                .map(RoomResponse::from));
    }

    @Override
    public RoomResponse getRoomById(Long id) {
        return roomRepository.findById(id)
                .map(RoomResponse::from)
                .orElseThrow(() -> new EntityNotFoundException("Room not found with id " + id));
    }

    @Override
    public List<RoomTypeResponse> getRoomTypes() {
        return Arrays.stream(RoomType.values())
                .map(RoomTypeResponse::from)
                .toList();
    }

    @Override
    @Transactional
    public RoomResponse createRoom(RoomRequest request) {
        Room room = new Room();
        mapRequestToEntity(request, room);
        Room savedRoom = roomRepository.save(room);
        return RoomResponse.from(savedRoom);
    }

    @Override
    @Transactional
    public RoomResponse updateRoom(Long id, RoomRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Room not found with id " + id));
        mapRequestToEntity(request, room);
        Room updatedRoom = roomRepository.save(room);
        return RoomResponse.from(updatedRoom);
    }

    @Override
    @Transactional
    public void deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new EntityNotFoundException("Room not found with id " + id);
        }
        roomRepository.deleteById(id);
    }

    private void mapRequestToEntity(RoomRequest request, Room room) {
        room.setName(request.getName());
        room.setRoomType(request.getRoomType());
        room.setPricePerNight(request.getPricePerNight());
        room.setCapacity(request.getCapacity());
        room.setArea(request.getArea());
        room.setImage(request.getImage());
        room.setAmenities(request.getAmenities());
        room.setAvailable(request.getAvailable());
        room.setFeatured(request.getFeatured());
    }

    private Sort resolveSort(String sortBy) {
        if (sortBy == null || sortBy.isBlank()) {
            return Sort.by(Sort.Direction.ASC, "pricePerNight");
        }

        return switch (sortBy) {
            case "price_desc" -> Sort.by(Sort.Direction.DESC, "pricePerNight");
            case "name_asc" -> Sort.by(Sort.Direction.ASC, "name");
            case "capacity_asc" -> Sort.by(Sort.Direction.ASC, "capacity");
            case "price_asc" -> Sort.by(Sort.Direction.ASC, "pricePerNight");
            default -> Sort.by(Sort.Direction.ASC, "pricePerNight");
        };
    }

    private Specification<Room> buildSpecification(
            String keyword,
            RoomType roomType,
            Integer capacity,
            Boolean available,
            Boolean featured,
            BigDecimal minPrice,
            BigDecimal maxPrice
    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (keyword != null && !keyword.isBlank()) {
                String normalizedKeyword = keyword.trim().toLowerCase(Locale.ROOT);
                Predicate nameContains = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("name")),
                        "%" + normalizedKeyword + "%"
                );

                try {
                    RoomType keywordRoomType = RoomType.valueOf(normalizedKeyword.toUpperCase(Locale.ROOT));
                    predicates.add(criteriaBuilder.or(nameContains, criteriaBuilder.equal(root.get("roomType"), keywordRoomType)));
                } catch (IllegalArgumentException exception) {
                    predicates.add(nameContains);
                }
            }

            if (roomType != null) {
                predicates.add(criteriaBuilder.equal(root.get("roomType"), roomType));
            }

            if (capacity != null && capacity > 0) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("capacity"), capacity));
            }

            if (available != null) {
                predicates.add(criteriaBuilder.equal(root.get("available"), available));
            }

            if (featured != null) {
                predicates.add(criteriaBuilder.equal(root.get("featured"), featured));
            }

            if (minPrice != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("pricePerNight"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("pricePerNight"), maxPrice));
            }

            return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }
}

