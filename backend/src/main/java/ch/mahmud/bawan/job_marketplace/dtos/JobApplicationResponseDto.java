package ch.mahmud.bawan.job_marketplace.dtos;

import ch.mahmud.bawan.job_marketplace.models.Status;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class JobApplicationResponseDto {

    private Integer applicationId;
    private Status status;
    private LocalDateTime appliedAt;

    private Integer jobId;
    private String jobTitle;

    private Integer jobSeekerId;
    private String jobSeekerName;
    private String jobSeekerEmail;

    private Integer employerId;
    private String employerName;
}