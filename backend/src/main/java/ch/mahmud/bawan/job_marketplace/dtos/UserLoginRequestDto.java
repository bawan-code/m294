package ch.mahmud.bawan.job_marketplace.dtos;

import lombok.Data;

@Data
public class UserLoginRequestDto {

    private String email;
    private String password;
}