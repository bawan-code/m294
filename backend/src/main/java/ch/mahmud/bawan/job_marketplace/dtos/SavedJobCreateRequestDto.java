package ch.mahmud.bawan.job_marketplace.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SavedJobCreateRequestDto {

    @NotNull(message = "User ID is required")
    private Integer userId;

    @NotNull(message = "Job ID is required")
    private Integer jobId;
}