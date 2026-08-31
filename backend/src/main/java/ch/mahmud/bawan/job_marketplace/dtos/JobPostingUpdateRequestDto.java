package ch.mahmud.bawan.job_marketplace.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class JobPostingUpdateRequestDto {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    private String salaryRange;
}