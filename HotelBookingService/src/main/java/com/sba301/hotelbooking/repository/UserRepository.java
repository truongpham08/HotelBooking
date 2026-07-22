package com.sba301.hotelbooking.repository;

import com.sba301.hotelbooking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("""
            SELECT u FROM User u
            WHERE u.role = 'USER'
              AND (:keyword IS NULL
                OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR u.phone LIKE CONCAT('%', :keyword, '%'))
            """)
    Page<User> searchCustomers(@Param("keyword") String keyword, Pageable pageable);
}
