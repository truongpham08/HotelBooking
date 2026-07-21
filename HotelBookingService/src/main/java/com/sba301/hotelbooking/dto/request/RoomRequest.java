package com.sba301.hotelbooking.dto.request;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.sba301.hotelbooking.enums.RoomType;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class RoomRequest {

    @NotBlank(message = "Room name is required")
    @Size(max = 120, message = "Room name must not exceed 120 characters")
    private String name;

    @NotNull(message = "Room type is required")
    private RoomType roomType;

    @NotNull(message = "Price per night is required")
    @Positive(message = "Price must be positive")
    private BigDecimal pricePerNight;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @Min(value = 1, message = "Area must be at least 1")
    private Integer area;

    @Size(max = 500, message = "Image URL must not exceed 500 characters")
    private String image;

    private List<String> amenities = new ArrayList<>();

    @NotNull(message = "Availability status is required")
    private Boolean available = true;

    @NotNull(message = "Featured status is required")
    private Boolean featured = false;

    // Getters and Setters

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public RoomType getRoomType() {
        return roomType;
    }

    public void setRoomType(RoomType roomType) {
        this.roomType = roomType;
    }

    public BigDecimal getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(BigDecimal pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getArea() {
        return area;
    }

    public void setArea(Integer area) {
        this.area = area;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public List<String> getAmenities() {
        return amenities;
    }

    public void setAmenities(List<String> amenities) {
        this.amenities = amenities;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public Boolean getFeatured() {
        return featured;
    }

    public void setFeatured(Boolean featured) {
        this.featured = featured;
    }
}
