package com.sba301.hotelbooking.dto.response;

import java.math.BigDecimal;
import java.util.List;

import com.sba301.hotelbooking.entity.Room;
import com.sba301.hotelbooking.enums.RoomType;

public record RoomResponse(
        Long id,
        String name,
        RoomType roomType,
        BigDecimal pricePerNight,
        Integer capacity,
        Integer area,
        String image,
        List<String> amenities,
        Boolean available
) {
    public static RoomResponse from(Room room) {
        return new RoomResponse(
                room.getId(),
                room.getName(),
                room.getRoomType(),
                room.getPricePerNight(),
                room.getCapacity(),
                room.getArea(),
                room.getImage(),
                room.getAmenities(),
                room.getAvailable()
        );
    }
}

