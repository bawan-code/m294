package ch.mahmud.bawan.job_marketplace.controllers;

import ch.mahmud.bawan.job_marketplace.dtos.SavedJobCreateRequestDto;
import ch.mahmud.bawan.job_marketplace.dtos.SavedJobResponseDto;
import ch.mahmud.bawan.job_marketplace.services.SavedJobService;
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
@Tag(name = "Saved Job", description = "Saved job management endpoints")
public class SavedJobController {

    private final SavedJobService savedJobService;

    public SavedJobController(SavedJobService savedJobService) {
        this.savedJobService = savedJobService;
    }

    @Operation(summary = "Save job", description = "Saves/bookmarks a job for a specific user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Job successfully saved"),
            @ApiResponse(responseCode = "400", description = "Invalid request body or user is not a job seeker"),
            @ApiResponse(responseCode = "404", description = "User or job posting not found")
    })
    @PostMapping("/saved-jobs")
    public ResponseEntity<SavedJobResponseDto> create(
            @Valid @RequestBody SavedJobCreateRequestDto request
    ) {
        return savedJobService.createSavedJob(request)
                .map(savedJob -> new ResponseEntity<>(savedJob, HttpStatus.CREATED))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @Operation(summary = "Get all saved jobs", description = "Returns a list of all saved jobs")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Saved jobs successfully returned")
    })
    @GetMapping("/saved-jobs")
    public ResponseEntity<List<SavedJobResponseDto>> all() {
        List<SavedJobResponseDto> result = savedJobService.getAllSavedJobs();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @Operation(summary = "Get saved job by ID", description = "Returns a single saved job by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Saved job successfully returned"),
            @ApiResponse(responseCode = "404", description = "Saved job not found")
    })
    @GetMapping("/saved-jobs/{savedJobId}")
    public ResponseEntity<SavedJobResponseDto> getById(@PathVariable Integer savedJobId) {
        return savedJobService.getSavedJobById(savedJobId)
                .map(savedJob -> new ResponseEntity<>(savedJob, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @Operation(summary = "Delete saved job", description = "Removes a saved job by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Saved job successfully deleted"),
            @ApiResponse(responseCode = "404", description = "Saved job not found")
    })
    @DeleteMapping("/saved-jobs/{savedJobId}")
    public ResponseEntity<Void> delete(@PathVariable Integer savedJobId) {
        boolean deleted = savedJobService.deleteSavedJob(savedJobId);

        if (!deleted) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Get saved jobs by user", description = "Returns all saved jobs of a specific user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Saved jobs successfully returned"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/users/{userId}/saved-jobs")
    public ResponseEntity<List<SavedJobResponseDto>> getByUserId(@PathVariable Integer userId) {
        return savedJobService.getSavedJobsByUserId(userId)
                .map(savedJobs -> new ResponseEntity<>(savedJobs, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}