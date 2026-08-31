package ch.mahmud.bawan.job_marketplace.services;

import ch.mahmud.bawan.job_marketplace.dtos.JobApplicationCreateRequestDto;
import ch.mahmud.bawan.job_marketplace.dtos.JobApplicationResponseDto;
import ch.mahmud.bawan.job_marketplace.dtos.JobApplicationStatusUpdateRequestDto;
import ch.mahmud.bawan.job_marketplace.models.JobApplication;
import ch.mahmud.bawan.job_marketplace.models.JobPosting;
import ch.mahmud.bawan.job_marketplace.models.Role;
import ch.mahmud.bawan.job_marketplace.models.Status;
import ch.mahmud.bawan.job_marketplace.models.User;
import ch.mahmud.bawan.job_marketplace.repositories.JobApplicationRepository;
import ch.mahmud.bawan.job_marketplace.repositories.JobPostingRepository;
import ch.mahmud.bawan.job_marketplace.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final UserRepository userRepository;
    private final JobPostingRepository jobPostingRepository;

    public JobApplicationService(
            JobApplicationRepository jobApplicationRepository,
            UserRepository userRepository,
            JobPostingRepository jobPostingRepository
    ) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.userRepository = userRepository;
        this.jobPostingRepository = jobPostingRepository;
    }

    public Optional<JobApplicationResponseDto> createJobApplication(JobApplicationCreateRequestDto request) {
        Optional<User> jobSeekerOptional = userRepository.findById(request.getJobSeekerId());
        Optional<JobPosting> jobPostingOptional = jobPostingRepository.findById(request.getJobId());

        if (jobSeekerOptional.isEmpty() || jobPostingOptional.isEmpty()) {
            return Optional.empty();
        }

        User jobSeeker = jobSeekerOptional.get();

        if (jobSeeker.getRole() != Role.JOB_SEEKER) {
            return Optional.empty();
        }

        JobPosting jobPosting = jobPostingOptional.get();

        JobApplication jobApplication = new JobApplication();
        jobApplication.setJobSeeker(jobSeeker);
        jobApplication.setJobPosting(jobPosting);
        jobApplication.setStatus(Status.PENDING);

        JobApplication savedApplication = jobApplicationRepository.save(jobApplication);

        return Optional.of(mapToJobApplicationResponseDto(savedApplication));
    }

    public List<JobApplicationResponseDto> getAllJobApplications() {
        return jobApplicationRepository.findAll()
                .stream()
                .map(this::mapToJobApplicationResponseDto)
                .toList();
    }

    public Optional<JobApplicationResponseDto> getJobApplicationById(Integer applicationId) {
        return jobApplicationRepository.findById(applicationId)
                .map(this::mapToJobApplicationResponseDto);
    }

    public Optional<JobApplicationResponseDto> updateJobApplicationStatus(
            Integer applicationId,
            JobApplicationStatusUpdateRequestDto request
    ) {
        return jobApplicationRepository.findById(applicationId)
                .map(existingApplication -> {
                    existingApplication.setStatus(request.getStatus());

                    JobApplication savedApplication = jobApplicationRepository.save(existingApplication);

                    return mapToJobApplicationResponseDto(savedApplication);
                });
    }

    public boolean deleteJobApplication(Integer applicationId) {
        if (!jobApplicationRepository.existsById(applicationId)) {
            return false;
        }

        jobApplicationRepository.deleteById(applicationId);
        return true;
    }

    public Optional<List<JobApplicationResponseDto>> getJobApplicationsByUserId(Integer userId) {
        if (!userRepository.existsById(userId)) {
            return Optional.empty();
        }

        List<JobApplicationResponseDto> applications = jobApplicationRepository.findByJobSeeker_UserId(userId)
                .stream()
                .map(this::mapToJobApplicationResponseDto)
                .toList();

        return Optional.of(applications);
    }

    public Optional<List<JobApplicationResponseDto>> getJobApplicationsByJobId(Integer jobId) {
        if (!jobPostingRepository.existsById(jobId)) {
            return Optional.empty();
        }

        List<JobApplicationResponseDto> applications = jobApplicationRepository.findByJobPosting_JobId(jobId)
                .stream()
                .map(this::mapToJobApplicationResponseDto)
                .toList();

        return Optional.of(applications);
    }

    private JobApplicationResponseDto mapToJobApplicationResponseDto(JobApplication jobApplication) {
        JobApplicationResponseDto dto = new JobApplicationResponseDto();

        dto.setApplicationId(jobApplication.getApplicationId());
        dto.setStatus(jobApplication.getStatus());
        dto.setAppliedAt(jobApplication.getAppliedAt());

        if (jobApplication.getJobPosting() != null) {
            JobPosting jobPosting = jobApplication.getJobPosting();

            dto.setJobId(jobPosting.getJobId());
            dto.setJobTitle(jobPosting.getTitle());

            if (jobPosting.getEmployer() != null) {
                dto.setEmployerId(jobPosting.getEmployer().getUserId());
                dto.setEmployerName(jobPosting.getEmployer().getName());
            }
        }

        if (jobApplication.getJobSeeker() != null) {
            User jobSeeker = jobApplication.getJobSeeker();

            dto.setJobSeekerId(jobSeeker.getUserId());
            dto.setJobSeekerName(jobSeeker.getName());
            dto.setJobSeekerEmail(jobSeeker.getEmail());
        }

        return dto;
    }
}