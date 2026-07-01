package com.sba301.hotelbooking.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sba301.hotelbooking.dto.response.PageResponse;
import com.sba301.hotelbooking.dto.response.RoomResponse;
import com.sba301.hotelbooking.dto.response.RoomTypeResponse;
import com.sba301.hotelbooking.enums.RoomType;
import com.sba301.hotelbooking.service.RoomService;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping
    public PageResponse<RoomResponse> getRooms(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) RoomType roomType,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) Boolean available,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String checkIn,
            @RequestParam(required = false) String checkOut
    ) {
        return roomService.getRooms(keyword, roomType, capacity, available, featured, minPrice, maxPrice, sortBy, page, size);
    }

    @GetMapping("/types")
    public List<RoomTypeResponse> getRoomTypes() {
        return roomService.getRoomTypes();
    }

    @GetMapping("/{id}")
    public RoomResponse getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id);
    }
}





