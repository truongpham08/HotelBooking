package com.booking.hotel.service;

import com.booking.hotel.dto.RoomDTO;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class RoomService {
    private final List<RoomDTO> rooms = List.of(
            room(1L, "Grand Deluxe Ocean View", "DELUXE", 2500000, 2, 45, "/room-deluxe.png", List.of("WiFi", "Minibar", "Bồn tắm", "Ban công"), true, "Phòng sang trọng, cửa kính lớn hướng biển và có ban công riêng."),
            room(2L, "Presidential Suite", "SUITE", 8500000, 4, 120, "/room-suite.png", List.of("WiFi", "Bể bơi riêng", "Butler", "Phòng khách", "Bếp"), true, "Phòng suite rộng rãi, có phòng khách và bể bơi riêng."),
            room(3L, "Superior Comfort Room", "STANDARD", 1200000, 2, 30, "/room-standard.png", List.of("WiFi", "TV 55 inch", "Điều hòa"), true, "Phòng tiết kiệm, đầy đủ tiện nghi cho chuyến đi ngắn ngày."),
            room(4L, "Family Deluxe Suite", "DELUXE", 3800000, 5, 75, "/room-deluxe.png", List.of("WiFi", "2 Phòng ngủ", "Bếp nhỏ", "Giường phụ"), true, "Phòng gia đình có hai phòng ngủ riêng và bếp nhỏ."),
            room(5L, "Classic Standard Room", "STANDARD", 950000, 1, 25, "/room-standard.png", List.of("WiFi", "Điều hòa", "Tủ lạnh nhỏ"), false, "Phòng gọn nhẹ dành cho một khách."),
            room(6L, "Honeymoon Ocean Suite", "SUITE", 6200000, 2, 90, "/room-suite.png", List.of("WiFi", "Bồn tắm ngoài trời", "Rượu vang", "Hoa tươi"), true, "Phòng hướng biển với không gian lãng mạn."),
            room(7L, "Executive Business Room", "DELUXE", 2200000, 2, 40, "/room-deluxe.png", List.of("WiFi tốc độ cao", "Bàn làm việc", "In ấn", "Minibar"), true, "Phòng phù hợp cho khách công tác."),
            room(8L, "Presidential Grand Suite", "PRESIDENTIAL", 15000000, 6, 250, "/room-suite.png", List.of("Butler riêng", "Bể bơi", "Phòng gym", "Bếp trưởng"), true, "Phòng cao cấp với không gian riêng tư rộng rãi.")
    );

    public List<RoomDTO> getAllRooms() {
        return rooms;
    }

    public RoomDTO getRoomById(Long id) {
        return rooms.stream().filter(room -> room.getId().equals(id)).findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phòng có mã " + id));
    }

    private static RoomDTO room(Long id, String name, String type, long price, int capacity,
                                int area, String image, List<String> amenities, boolean available, String description) {
        return RoomDTO.builder()
                .id(id).name(name).roomType(type).pricePerNight(BigDecimal.valueOf(price))
                .capacity(capacity).area(area).image(image).images(List.of(image, image, image))
                .amenities(amenities).available(available).description(description).rating(4.8)
                .reviews(List.of(
                        new RoomDTO.ReviewDTO("Minh Anh", 5, "Phòng sạch sẽ, nhân viên thân thiện."),
                        new RoomDTO.ReviewDTO("Hoàng Nam", 5, "Không gian thoải mái, đúng như hình.")
                )).build();
    }
}
