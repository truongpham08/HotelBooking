package com.sba301.hotelbooking.dto;

import com.sba301.hotelbooking.enums.RoomType;

public record RoomTypeResponse(
        String value,
        String label
) {
    public static RoomTypeResponse from(RoomType roomType) {
        return new RoomTypeResponse(roomType.name(), toLabel(roomType));
    }

    private static String toLabel(RoomType roomType) {
        return switch (roomType) {
            case STANDARD -> "Standard";
            case DELUXE -> "Deluxe";
            case SUITE -> "Suite";
            case PRESIDENTIAL -> "Presidential";
        };
    }
}
