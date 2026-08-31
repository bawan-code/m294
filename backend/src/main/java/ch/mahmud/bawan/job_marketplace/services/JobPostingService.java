package ch.mahmud.bawan.job_marketplace.services;

import ch.mahmud.bawan.job_marketplace.dtos.JobPostingCreateRequestDto;
import ch.mahmud.bawan.job_marketplace.dtos.JobPostingResponseDto;
import ch.mahmud.bawan.job_marketplace.dtos.JobPostingUpdateRequestDto;
import ch.mahmud.bawan.job_marketplace.models.JobPosting;
import ch.mahmud.bawan.job_marketplace.models.Role;
import ch.mahmud.bawan.job_marketplace.models.User;
import ch.mahmud.bawan.job_marketplace.repositories.JobPostingRepository;
import ch.mahmud.bawan.job_marketplace.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobPostingService {

    private final JobPostingRepository jobPostingRepository;
    private final UserRepository userRepository;

    public JobPostingService(
            JobPostingRepository jobPostingRepository,
            UserRepository userRepository
    ) {
        this.jobPostingRepository = jobPostingRepository;
        this.userRepository = userRepository;
    }

    public Optional<JobPostingResponseDto> createJobPosting(JobPostingCreateRequestDto request) {
        Optional<User> employerOptional = userRepository.findById(request.getEmployerId());

        if (employerOptional.isEmpty()) {
            return Optional.empty();
        }

        User employer = employerOptional.get();

        if (employer.getRole() != Role.EMPLOYER) {
            return Optional.empty();
        }

        JobPosting jobPosting = new JobPosting();
        jobPosting.setTitle(request.getTitle());
        jobPosting.setDescription(request.getDescription());
        jobPosting.setLocation(request.getLocation());
        jobPosting.setSalaryRange(request.getSalaryRange());
        jobPosting.setEmployer(employer);

        JobPosting savedJobPosting = jobPostingRepository.save(jobPosting);

        return Optional.of(mapToJobPostingResponseDto(savedJobPosting));
    }

    public List<JobPostingResponseDto> getAllJobPostings() {
        return jobPostingRepository.findAll()
                .stream()
                .map(this::mapToJobPostingResponseDto)
                .toList();
    }

    public Optional<JobPostingResponseDto> getJobPostingById(Integer jobId) {
        return jobPostingRepository.findById(jobId)
                .map(this::mapToJobPostingResponseDto);
    }

    public Optional<JobPostingResponseDto> updateJobPosting(
            Integer jobId,
            JobPostingUpdateRequestDto request
    ) {
        return jobPostingRepository.findById(jobId)
                .map(existingJobPosting -> {
                    existingJobPosting.setTitle(request.getTitle());
                    existingJobPosting.setDescription(request.getDescription());
                    existingJobPosting.setLocation(request.getLocation());
                    existingJobPosting.setSalaryRange(request.getSalaryRange());

                    JobPosting savedJobPosting = jobPostingRepository.save(existingJobPosting);

                    return mapToJobPostingResponseDto(savedJobPosting);
                });
    }

    public boolean deleteJobPosting(Integer jobId) {
        if (!jobPostingRepository.existsById(jobId)) {
            return false;
        }

        jobPostingRepository.deleteById(jobId);
        return true;
    }

    public Optional<List<JobPostingResponseDto>> getJobPostingsByUserId(Integer userId) {
        if (!userRepository.existsById(userId)) {
            return Optional.empty();
        }

        List<JobPostingResponseDto> jobPostings = jobPostingRepository.findByEmployer_UserId(userId)
                .stream()
                .map(this::mapToJobPostingResponseDto)
                .toList();

        return Optional.of(jobPostings);
    }

    private JobPostingResponseDto mapToJobPostingResponseDto(JobPosting jobPosting) {
        JobPostingResponseDto dto = new JobPostingResponseDto();

        dto.setJobId(jobPosting.getJobId());
        dto.setTitle(jobPosting.getTitle());
        dto.setDescription(jobPosting.getDescription());
        dto.setLocation(jobPosting.getLocation());
        dto.setSalaryRange(jobPosting.getSalaryRange());
        dto.setCreatedAt(jobPosting.getCreatedAt());
        dto.setUpdatedAt(jobPosting.getUpdatedAt());

        if (jobPosting.getEmployer() != null) {
            dto.setEmployerId(jobPosting.getEmployer().getUserId());
            dto.setEmployerName(jobPosting.getEmployer().getName());
            dto.setEmployerEmail(jobPosting.getEmployer().getEmail());
        }

        return dto;
    }
}