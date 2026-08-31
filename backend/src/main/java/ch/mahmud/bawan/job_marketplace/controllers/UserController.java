package ch.mahmud.bawan.job_marketplace.controllers;

import ch.mahmud.bawan.job_marketplace.dtos.JobPostingResponseDto;
import ch.mahmud.bawan.job_marketplace.dtos.UserResponseDto;
import ch.mahmud.bawan.job_marketplace.dtos.UserUpdateRequestDto;
import ch.mahmud.bawan.job_marketplace.services.JobPostingService;
import ch.mahmud.bawan.job_marketplace.services.UserService;
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
@RequestMapping("/api/users")
@Tag(name = "User", description = "User management endpoints")
public class UserController {

    private final UserService userService;
    private final JobPostingService jobPostingService;

    public UserController(UserService userService, JobPostingService jobPostingService) {
        this.userService = userService;
        this.jobPostingService = jobPostingService;
    }

    @Operation(summary = "Get all users", description = "Returns a list of all users")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Users successfully returned")
    })
    @GetMapping
    public ResponseEntity<List<UserResponseDto>> all() {
        List<UserResponseDto> result = userService.getAllUsers();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @Operation(summary = "Get user by ID", description = "Returns a single user by their ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User successfully returned"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponseDto> getById(@PathVariable Integer userId) {
        return userService.getUserById(userId)
                .map(user -> new ResponseEntity<>(user, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @Operation(summary = "Update user", description = "Updates an existing user by their ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User successfully updated"),
            @ApiResponse(responseCode = "400", description = "Invalid request body"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PutMapping("/{userId}")
    public ResponseEntity<UserResponseDto> update(
            @PathVariable Integer userId,
            @Valid @RequestBody UserUpdateRequestDto request
    ) {
        return userService.updateUser(userId, request)
                .map(user -> new ResponseEntity<>(user, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @Operation(summary = "Delete user", description = "Deletes an existing user by their ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "User successfully deleted"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> delete(@PathVariable Integer userId) {
        boolean deleted = userService.deleteUser(userId);

        if (!deleted) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Get job postings by user", description = "Returns all job postings created by a specific employer")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Job postings successfully returned"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/{userId}/job-postings")
    public ResponseEntity<List<JobPostingResponseDto>> getJobPostingsByUserId(@PathVariable Integer userId) {
        return jobPostingService.getJobPostingsByUserId(userId)
                .map(jobPostings -> new ResponseEntity<>(jobPostings, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
