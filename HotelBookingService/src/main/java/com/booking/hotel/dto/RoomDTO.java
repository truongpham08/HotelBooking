package com.booking.hotel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomDTO {
    private Long id;
    private String name;
    private String roomType;
    private BigDecimal pricePerNight;
    private Integer capacity;
    private Integer area;
    private String image;
    private List<String> images;
    private List<String> amenities;
    private boolean available;
    private String description;
    private Double rating;
    private List<ReviewDTO> reviews;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ReviewDTO {
        private String customerName;
        private Integer rating;
        private String comment;
    }
}
