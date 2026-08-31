package ch.mahmud.bawan.job_marketplace.controllers;

import ch.mahmud.bawan.job_marketplace.dtos.JobPostingCreateRequestDto;
import ch.mahmud.bawan.job_marketplace.dtos.JobPostingResponseDto;
import ch.mahmud.bawan.job_marketplace.dtos.JobPostingUpdateRequestDto;
import ch.mahmud.bawan.job_marketplace.services.JobPostingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.security.oauth2.server.resource.autoconfigure.servlet.OAuth2ResourceServerAutoConfiguration;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        controllers = JobPostingController.class,
        excludeAutoConfiguration = OAuth2ResourceServerAutoConfiguration.class
)
@AutoConfigureMockMvc(addFilters = false)
class JobPostingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private JobPostingService jobPostingService;

    @Test
    void create_shouldReturnCreatedJobPosting_whenEmployerExists() throws Exception {
        JobPostingCreateRequestDto request = new JobPostingCreateRequestDto();
        request.setTitle("Java Developer");
        request.setDescription("Spring Boot backend developer");
        request.setLocation("Basel");
        request.setSalaryRange("80000-100000 CHF");
        request.setEmployerId(1);

        JobPostingResponseDto response = createJobPostingResponseDto();

        Mockito.when(jobPostingService.createJobPosting(any(JobPostingCreateRequestDto.class)))
                .thenReturn(Optional.of(response));

        mockMvc.perform(post("/api/job-postings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.jobId").value(1))
                .andExpect(jsonPath("$.title").value("Java Developer"))
                .andExpect(jsonPath("$.description").value("Spring Boot backend developer"))
                .andExpect(jsonPath("$.location").value("Basel"))
                .andExpect(jsonPath("$.salaryRange").value("80000-100000 CHF"))
                .andExpect(jsonPath("$.employerId").value(1))
                .andExpect(jsonPath("$.employerName").value("Test Employer"))
                .andExpect(jsonPath("$.employerEmail").value("employer@example.com"));
    }

    @Test
    void create_shouldReturnNotFound_whenEmployerDoesNotExist() throws Exception {
        JobPostingCreateRequestDto request = new JobPostingCreateRequestDto();
        request.setTitle("Java Developer");
        request.setDescription("Spring Boot backend developer");
        request.setLocation("Basel");
        request.setSalaryRange("80000-100000 CHF");
        request.setEmployerId(999);

        Mockito.when(jobPostingService.createJobPosting(any(JobPostingCreateRequestDto.class)))
                .thenReturn(Optional.empty());

        mockMvc.perform(post("/api/job-postings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void all_shouldReturnAllJobPostings() throws Exception {
        JobPostingResponseDto jobPosting = createJobPostingResponseDto();

        Mockito.when(jobPostingService.getAllJobPostings())
                .thenReturn(List.of(jobPosting));

        mockMvc.perform(get("/api/job-postings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].jobId").value(1))
                .andExpect(jsonPath("$[0].title").value("Java Developer"))
                .andExpect(jsonPath("$[0].location").value("Basel"));
    }

    @Test
    void getById_shouldReturnJobPosting_whenJobPostingExists() throws Exception {
        JobPostingResponseDto response = createJobPostingResponseDto();

        Mockito.when(jobPostingService.getJobPostingById(1))
                .thenReturn(Optional.of(response));

        mockMvc.perform(get("/api/job-postings/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.jobId").value(1))
                .andExpect(jsonPath("$.title").value("Java Developer"))
                .andExpect(jsonPath("$.employerName").value("Test Employer"));
    }

    @Test
    void getById_shouldReturnNotFound_whenJobPostingDoesNotExist() throws Exception {
        Mockito.when(jobPostingService.getJobPostingById(999))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/job-postings/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void update_shouldReturnUpdatedJobPosting_whenJobPostingExists() throws Exception {
        JobPostingUpdateRequestDto request = new JobPostingUpdateRequestDto();
        request.setTitle("Senior Java Developer");
        request.setDescription("Updated description");
        request.setLocation("Zürich");
        request.setSalaryRange("100000-120000 CHF");

        JobPostingResponseDto response = createJobPostingResponseDto();
        response.setTitle("Senior Java Developer");
        response.setDescription("Updated description");
        response.setLocation("Zürich");
        response.setSalaryRange("100000-120000 CHF");

        Mockito.when(jobPostingService.updateJobPosting(eq(1), any(JobPostingUpdateRequestDto.class)))
                .thenReturn(Optional.of(response));

        mockMvc.perform(put("/api/job-postings/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.jobId").value(1))
                .andExpect(jsonPath("$.title").value("Senior Java Developer"))
                .andExpect(jsonPath("$.description").value("Updated description"))
                .andExpect(jsonPath("$.location").value("Zürich"))
                .andExpect(jsonPath("$.salaryRange").value("100000-120000 CHF"));
    }

    @Test
    void update_shouldReturnNotFound_whenJobPostingDoesNotExist() throws Exception {
        JobPostingUpdateRequestDto request = new JobPostingUpdateRequestDto();
        request.setTitle("Senior Java Developer");
        request.setDescription("Updated description");
        request.setLocation("Zürich");
        request.setSalaryRange("100000-120000 CHF");

        Mockito.when(jobPostingService.updateJobPosting(eq(999), any(JobPostingUpdateRequestDto.class)))
                .thenReturn(Optional.empty());

        mockMvc.perform(put("/api/job-postings/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_shouldReturnNoContent_whenJobPostingExists() throws Exception {
        Mockito.when(jobPostingService.deleteJobPosting(1))
                .thenReturn(true);

        mockMvc.perform(delete("/api/job-postings/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void delete_shouldReturnNotFound_whenJobPostingDoesNotExist() throws Exception {
        Mockito.when(jobPostingService.deleteJobPosting(999))
                .thenReturn(false);

        mockMvc.perform(delete("/api/job-postings/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getByUserId_shouldReturnJobPostings_whenUserExists() throws Exception {
        JobPostingResponseDto response = createJobPostingResponseDto();

        Mockito.when(jobPostingService.getJobPostingsByUserId(1))
                .thenReturn(Optional.of(List.of(response)));

        mockMvc.perform(get("/api/job-postings/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].jobId").value(1))
                .andExpect(jsonPath("$[0].employerId").value(1))
                .andExpect(jsonPath("$[0].employerName").value("Test Employer"));
    }

    @Test
    void getByUserId_shouldReturnNotFound_whenUserDoesNotExist() throws Exception {
        Mockito.when(jobPostingService.getJobPostingsByUserId(999))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/job-postings/users/999"))
                .andExpect(status().isNotFound());
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