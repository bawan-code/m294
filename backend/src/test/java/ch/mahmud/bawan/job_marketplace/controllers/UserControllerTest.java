package ch.mahmud.bawan.job_marketplace.controllers;

import ch.mahmud.bawan.job_marketplace.dtos.JobPostingResponseDto;
import ch.mahmud.bawan.job_marketplace.dtos.UserResponseDto;
import ch.mahmud.bawan.job_marketplace.models.Role;
import ch.mahmud.bawan.job_marketplace.services.JobPostingService;
import ch.mahmud.bawan.job_marketplace.services.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.security.oauth2.server.resource.autoconfigure.servlet.OAuth2ResourceServerAutoConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(
        controllers = UserController.class,
        excludeAutoConfiguration = OAuth2ResourceServerAutoConfiguration.class
)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private JobPostingService jobPostingService;

    @Test
    void me_shouldReturnCurrentUser_whenLocalUserExists() throws Exception {
        Mockito.when(userService.getCurrentUser())
                .thenReturn(Optional.of(createUserResponseDto()));

        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.name").value("Test Seeker"))
                .andExpect(jsonPath("$.email").value("seeker@example.com"))
                .andExpect(jsonPath("$.role").value("JOB_SEEKER"));
    }

    @Test
    void me_shouldReturnNotFound_whenNoLocalUserExists() throws Exception {
        Mockito.when(userService.getCurrentUser())
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getJobPostingsByUserId_shouldReturnJobPostings_whenUserExists() throws Exception {
        Mockito.when(jobPostingService.getJobPostingsByUserId(1))
                .thenReturn(Optional.of(List.of(createJobPostingResponseDto())));

        mockMvc.perform(get("/api/users/1/job-postings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].jobId").value(1))
                .andExpect(jsonPath("$[0].employerId").value(1))
                .andExpect(jsonPath("$[0].employerName").value("Test Employer"));
    }

    @Test
    void getJobPostingsByUserId_shouldReturnNotFound_whenUserDoesNotExist() throws Exception {
        Mockito.when(jobPostingService.getJobPostingsByUserId(999))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/users/999/job-postings"))
                .andExpect(status().isNotFound());
    }

    private UserResponseDto createUserResponseDto() {
        UserResponseDto dto = new UserResponseDto();

        dto.setUserId(1);
        dto.setKeycloakId("11111111-2222-3333-4444-555555555555");
        dto.setName("Test Seeker");
        dto.setEmail("seeker@example.com");
        dto.setRole(Role.JOB_SEEKER);
        dto.setCreatedAt(LocalDateTime.of(2026, 5, 7, 10, 0));

        return dto;
    }

    private JobPostingResponseDto createJobPostingResponseDto() {
        JobPostingResponseDto dto = new JobPostingResponseDto();

        dto.setJobId(1);
        dto.setTitle("Java Developer");
        dto.setDescription("Spring Boot backend developer");
        dto.setLocation("Basel");
        dto.setSalaryRange("80000-100000 CHF");
        dto.setCreatedAt(LocalDateTime.of(2026, 5, 7, 10, 0));
        dto.setUpdatedAt(LocalDateTime.of(2026, 5, 7, 10, 0));

        dto.setEmployerId(1);
        dto.setEmployerName("Test Employer");
        dto.setEmployerEmail("employer@example.com");

        return dto;
    }
}
