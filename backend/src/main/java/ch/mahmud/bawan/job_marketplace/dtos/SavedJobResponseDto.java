package ch.mahmud.bawan.job_marketplace.dtos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SavedJobResponseDto {

    private Integer savedJobId;
    private LocalDateTime savedAt;

    private Integer userId;
    private String userName;
    private String userEmail;

    private Integer jobId;
    private String jobTitle;
    private String jobLocation;
    private String salaryRange;

    private Integer employerId;
    private String employerName;
}