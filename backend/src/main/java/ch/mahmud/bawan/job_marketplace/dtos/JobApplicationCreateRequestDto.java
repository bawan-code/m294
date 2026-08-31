package ch.mahmud.bawan.job_marketplace.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class JobApplicationCreateRequestDto {

    @NotNull(message = "Job seeker ID is required")
    private Integer jobSeekerId;

    @NotNull(message = "Job ID is required")
    private Integer jobId;
}