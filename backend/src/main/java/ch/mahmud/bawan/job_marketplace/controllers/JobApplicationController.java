package ch.mahmud.bawan.job_marketplace.controllers;

import ch.mahmud.bawan.job_marketplace.dtos.JobApplicationCreateRequestDto;
import ch.mahmud.bawan.job_marketplace.dtos.JobApplicationResponseDto;
import ch.mahmud.bawan.job_marketplace.dtos.JobApplicationStatusUpdateRequestDto;
import ch.mahmud.bawan.job_marketplace.services.JobApplicationService;
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
@RequestMapping("/api")
@Tag(name = "Job Application", description = "Job application management endpoints")
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    public JobApplicationController(JobApplicationService jobApplicationService) {
        this.jobApplicationService = jobApplicationService;
    }

    @Operation(summary = "Create job application", description = "Creates a new job application for a job posting")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Job application successfully created"),
            @ApiResponse(responseCode = "400", description = "Invalid request body or user is not a job seeker"),
            @ApiResponse(responseCode = "404", description = "User or job posting not found")
    })
    @PostMapping("/job-applications")
    public ResponseEntity<JobApplicationResponseDto> create(
            @Valid @RequestBody JobApplicationCreateRequestDto request
    ) {
        return jobApplicationService.createJobApplication(request)
                .map(application -> new ResponseEntity<>(application, HttpStatus.CREATED))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @Operation(summary = "Get all job applications", description = "Returns a list of all job applications")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Job applications successfully returned")
    })
    @GetMapping("/job-applications")
    public ResponseEntity<List<JobApplicationResponseDto>> all() {
        List<JobApplicationResponseDto> result = jobApplicationService.getAllJobApplications();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @Operation(summary = "Get job application by ID", description = "Returns a single job application by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Job application successfully returned"),
            @ApiResponse(responseCode = "404", description = "Job application not found")
    })
    @GetMapping("/job-applications/{applicationId}")
    public ResponseEntity<JobApplicationResponseDto> getById(@PathVariable Integer applicationId) {
        return jobApplicationService.getJobApplicationById(applicationId)
                .map(application -> new ResponseEntity<>(application, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @Operation(summary = "Update job application status", description = "Updates the status of a job application")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Job application status successfully updated"),
            @ApiResponse(responseCode = "400", description = "Invalid request body"),
            @ApiResponse(responseCode = "404", description = "Job application not found")
    })
    @PatchMapping("/job-applications/{applicationId}/status")
    public ResponseEntity<JobApplicationResponseDto> updateStatus(
            @PathVariable Integer applicationId,
            @Valid @RequestBody JobApplicationStatusUpdateRequestDto request
    ) {
        return jobApplicationService.updateJobApplicationStatus(applicationId, request)
                .map(application -> new ResponseEntity<>(application, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @Operation(summary = "Delete job application", description = "Deletes an existing job application by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Job application successfully deleted"),
            @ApiResponse(responseCode = "404", description = "Job application not found")
    })
    @DeleteMapping("/job-applications/{applicationId}")
    public ResponseEntity<Void> delete(@PathVariable Integer applicationId) {
        boolean deleted = jobApplicationService.deleteJobApplication(applicationId);

        if (!deleted) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Get job applications by user", description = "Returns all job applications submitted by a specific user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Job applications successfully returned"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/users/{userId}/job-applications")
    public ResponseEntity<List<JobApplicationResponseDto>> getByUserId(@PathVariable Integer userId) {
        return jobApplicationService.getJobApplicationsByUserId(userId)
                .map(applications -> new ResponseEntity<>(applications, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @Operation(summary = "Get job applications by job posting", description = "Returns all job applications for a specific job posting")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Job applications successfully returned"),
            @ApiResponse(responseCode = "404", description = "Job posting not found")
    })
    @GetMapping("/job-postings/{jobId}/job-applications")
    public ResponseEntity<List<JobApplicationResponseDto>> getByJobId(@PathVariable Integer jobId) {
        return jobApplicationService.getJobApplicationsByJobId(jobId)
                .map(applications -> new ResponseEntity<>(applications, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}