package com.sba301.hotelbooking.service;

import com.sba301.hotelbooking.dto.response.AdminUserDetailResponse;
import com.sba301.hotelbooking.dto.response.AdminUserResponse;
import com.sba301.hotelbooking.dto.response.PageResponse;

public interface AdminUserService {
    PageResponse<AdminUserResponse> getUsers(String keyword, Integer page, Integer size);

    AdminUserDetailResponse getUser(Long id);
}
