package ch.mahmud.bawan.job_marketplace.dtos;

import ch.mahmud.bawan.job_marketplace.models.Role;
import lombok.Data;

@Data
public class UserRegisterRequestDto {

    private String name;
    private String email;
    private String password;
    private Role role;
}