package com.sba301.hotelbooking.service;

import java.math.BigDecimal;
import java.util.List;

import com.sba301.hotelbooking.dto.request.RoomRequest;
import com.sba301.hotelbooking.dto.response.PageResponse;
import com.sba301.hotelbooking.dto.response.RoomResponse;
import com.sba301.hotelbooking.dto.response.RoomTypeResponse;
import com.sba301.hotelbooking.enums.RoomType;

public interface RoomService {

    PageResponse<RoomResponse> getRooms(
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
    );

    RoomResponse getRoomById(Long id);

    List<RoomTypeResponse> getRoomTypes();

    RoomResponse createRoom(RoomRequest request);

    RoomResponse updateRoom(Long id, RoomRequest request);

    void deleteRoom(Long id);
}
