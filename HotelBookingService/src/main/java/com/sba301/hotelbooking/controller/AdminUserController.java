package com.sba301.hotelbooking.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sba301.hotelbooking.dto.response.AdminUserDetailResponse;
import com.sba301.hotelbooking.dto.response.AdminUserResponse;
import com.sba301.hotelbooking.dto.response.PageResponse;
import com.sba301.hotelbooking.service.AdminUserService;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {
    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @GetMapping
    public PageResponse<AdminUserResponse> getUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        return adminUserService.getUsers(keyword, page, size);
    }

    @GetMapping("/{id}")
    public AdminUserDetailResponse getUser(@PathVariable Long id) {
        return adminUserService.getUser(id);
    }
}
