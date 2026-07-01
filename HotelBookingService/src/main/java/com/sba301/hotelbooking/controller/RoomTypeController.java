package com.sba301.hotelbooking.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sba301.hotelbooking.dto.RoomTypeResponse;
import com.sba301.hotelbooking.service.RoomService;

@RestController
@RequestMapping("/api/room-types")
public class RoomTypeController {

    private final RoomService roomService;

    public RoomTypeController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping
    public List<RoomTypeResponse> getRoomTypes() {
        return roomService.getRoomTypes();
    }
}
