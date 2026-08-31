package ch.mahmud.bawan.job_marketplace.dtos;

import ch.mahmud.bawan.job_marketplace.models.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {

    private Integer userId;
    private String keycloakId;
    private String name;
    private String email;
    private Role role;
    private LocalDateTime createdAt;

}