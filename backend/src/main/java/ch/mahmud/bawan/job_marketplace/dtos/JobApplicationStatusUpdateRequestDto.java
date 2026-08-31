package ch.mahmud.bawan.job_marketplace.dtos;

import ch.mahmud.bawan.job_marketplace.models.Status;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class JobApplicationStatusUpdateRequestDto {

    @NotNull(message = "Status is required")
    private Status status;
}