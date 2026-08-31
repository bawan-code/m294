package ch.mahmud.bawan.job_marketplace.dtos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class JobPostingResponseDto {

    private Integer jobId;
    private String title;
    private String description;
    private String location;
    private String salaryRange;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Integer employerId;
    private String employerName;
    private String employerEmail;
}