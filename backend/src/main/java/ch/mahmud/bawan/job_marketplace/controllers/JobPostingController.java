package ch.mahmud.bawan.job_marketplace.controllers;

import ch.mahmud.bawan.job_marketplace.dtos.JobPostingCreateRequestDto;
import ch.mahmud.bawan.job_marketplace.dtos.JobPostingResponseDto;
import ch.mahmud.bawan.job_marketplace.dtos.JobPostingUpdateRequestDto;
import ch.mahmud.bawan.job_marketplace.services.JobPostingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Validated
@RequestMapping("/api/job-postings")
@Tag(name = "Job Posting", description = "Job posting management endpoints")
public class JobPostingController {

    private final JobPostingService jobPostingService;

    public JobPostingController(JobPostingService jobPostingService) {
        this.jobPostingService = jobPostingService;
    }

    @Operation(summary = "Create job posting", description = "Creates a new job posting")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Job posting successfully created"),
            @ApiResponse(responseCode = "400", description = "Invalid request body"),
            @ApiResponse(responseCode = "404", description = "Employer not found")
    })
    @PostMapping
    public ResponseEntity<JobPostingResponseDto> create(
            @Valid @RequestBody JobPostingCreateRequestDto request
    ) {
        return jobPostingService.createJobPosting(request)
                .map(jobPosting -> new ResponseEntity<>(jobPosting, HttpStatus.CREATED))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @Operation(summary = "Get all job postings", description = "Returns a list of all job postings")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Job postings successfully returned")
    })
    @GetMapping
    public ResponseEntity<List<JobPostingResponseDto>> all() {
        List<JobPostingResponseDto> result = jobPostingService.getAllJobPostings();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @Operation(summary = "Get job posting by ID", description = "Returns a single job posting by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Job posting successfully returned"),
            @ApiResponse(responseCode = "404", description = "Job posting not found")
    })
    @GetMapping("/{jobId}")
    public ResponseEntity<JobPostingResponseDto> getById(@PathVariable Integer jobId) {
        return jobPostingService.getJobPostingById(jobId)
                .map(jobPosting -> new ResponseEntity<>(jobPosting, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @Operation(summary = "Update job posting", description = "Updates an existing job posting by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Job posting successfully updated"),
            @ApiResponse(responseCode = "400", description = "Invalid request body"),
            @ApiResponse(responseCode = "404", description = "Job posting not found")
    })
    @PutMapping("/{jobId}")
    public ResponseEntity<JobPostingResponseDto> update(
            @PathVariable Integer jobId,
            @Valid @RequestBody JobPostingUpdateRequestDto request
    ) {
        return jobPostingService.updateJobPosting(jobId, request)
                .map(jobPosting -> new ResponseEntity<>(jobPosting, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @Operation(summary = "Delete job posting", description = "Deletes an existing job posting by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Job posting successfully deleted"),
            @ApiResponse(responseCode = "404", description = "Job posting not found")
    })
    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void> delete(@PathVariable Integer jobId) {
        boolean deleted = jobPostingService.deleteJobPosting(jobId);

        if (!deleted) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}