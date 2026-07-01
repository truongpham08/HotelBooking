package com.sba301.hotelbooking.config;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.sba301.hotelbooking.entity.Room;
import com.sba301.hotelbooking.repository.RoomRepository;
import com.sba301.hotelbooking.enums.RoomType;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedRooms(RoomRepository roomRepository) {
        return args -> {
            if (roomRepository.count() > 0) {
                return;
            }

            roomRepository.saveAll(List.of(
                    room("Phong Deluxe View Bien", RoomType.DELUXE, 850000, 2, 35, "/room-deluxe.png",
                            List.of("WiFi", "Dieu hoa", "TV", "Ban cong"), true, true),
                    room("Phong Suite Gia Dinh", RoomType.SUITE, 1500000, 4, 65, "/room-suite.png",
                            List.of("WiFi", "2 phong ngu", "Phong khach", "Bep nho"), true, true),
                    room("Phong Standard Tieu Chuan", RoomType.STANDARD, 450000, 2, 25, "/room-standard.png",
                            List.of("WiFi", "TV", "Dieu hoa"), true, true),
                    room("Phong Deluxe Gia Dinh", RoomType.DELUXE, 1100000, 4, 50, "/room-deluxe.png",
                            List.of("WiFi", "2 giuong doi", "Dieu hoa", "Tu lanh"), true, true),
                    room("Grand Deluxe Ocean View", RoomType.DELUXE, 2500000, 2, 45, "/room-deluxe.png",
                            List.of("WiFi", "Minibar", "Bon tam", "Ban cong"), true, false),
                    room("Presidential Suite", RoomType.SUITE, 8500000, 4, 120, "/room-suite.png",
                            List.of("WiFi", "Be boi rieng", "Butler", "Phong khach", "Bep"), true, false),
                    room("Classic Standard Room", RoomType.STANDARD, 950000, 1, 25, "/room-standard.png",
                            List.of("WiFi", "Dieu hoa", "Tu lanh nho"), false, false),
                    room("Presidential Grand Suite", RoomType.PRESIDENTIAL, 15000000, 6, 250, "/room-suite.png",
                            List.of("Butler rieng", "Be boi", "Phong tap gym", "Bep truong"), true, false)
            ));
        };
    }

    private Room room(
            String name,
            RoomType roomType,
            int pricePerNight,
            int capacity,
            int area,
            String image,
            List<String> amenities,
            boolean available,
            boolean featured
    ) {
        Room room = new Room();
        room.setName(name);
        room.setRoomType(roomType);
        room.setPricePerNight(BigDecimal.valueOf(pricePerNight));
        room.setCapacity(capacity);
        room.setArea(area);
        room.setImage(image);
        room.setAmenities(amenities);
        room.setAvailable(available);
        room.setFeatured(featured);
        return room;
    }
}

