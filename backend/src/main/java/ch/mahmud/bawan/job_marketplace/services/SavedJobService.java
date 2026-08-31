package ch.mahmud.bawan.job_marketplace.services;

import ch.mahmud.bawan.job_marketplace.dtos.SavedJobCreateRequestDto;
import ch.mahmud.bawan.job_marketplace.dtos.SavedJobResponseDto;
import ch.mahmud.bawan.job_marketplace.models.JobPosting;
import ch.mahmud.bawan.job_marketplace.models.Role;
import ch.mahmud.bawan.job_marketplace.models.SavedJob;
import ch.mahmud.bawan.job_marketplace.models.User;
import ch.mahmud.bawan.job_marketplace.repositories.JobPostingRepository;
import ch.mahmud.bawan.job_marketplace.repositories.SavedJobRepository;
import ch.mahmud.bawan.job_marketplace.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final UserRepository userRepository;
    private final JobPostingRepository jobPostingRepository;

    public SavedJobService(
            SavedJobRepository savedJobRepository,
            UserRepository userRepository,
            JobPostingRepository jobPostingRepository
    ) {
        this.savedJobRepository = savedJobRepository;
        this.userRepository = userRepository;
        this.jobPostingRepository = jobPostingRepository;
    }

    public Optional<SavedJobResponseDto> createSavedJob(SavedJobCreateRequestDto request) {
        Optional<User> userOptional = userRepository.findById(request.getUserId());
        Optional<JobPosting> jobPostingOptional = jobPostingRepository.findById(request.getJobId());

        if (userOptional.isEmpty() || jobPostingOptional.isEmpty()) {
            return Optional.empty();
        }

        User user = userOptional.get();

        if (user.getRole() != Role.JOB_SEEKER) {
            return Optional.empty();
        }

        JobPosting jobPosting = jobPostingOptional.get();

        SavedJob savedJob = new SavedJob();
        savedJob.setUser(user);
        savedJob.setJobPosting(jobPosting);

        SavedJob savedResult = savedJobRepository.save(savedJob);

        return Optional.of(mapToSavedJobResponseDto(savedResult));
    }

    public List<SavedJobResponseDto> getAllSavedJobs() {
        return savedJobRepository.findAll()
                .stream()
                .map(this::mapToSavedJobResponseDto)
                .toList();
    }

    public Optional<SavedJobResponseDto> getSavedJobById(Integer savedJobId) {
        return savedJobRepository.findById(savedJobId)
                .map(this::mapToSavedJobResponseDto);
    }

    public boolean deleteSavedJob(Integer savedJobId) {
        if (!savedJobRepository.existsById(savedJobId)) {
            return false;
        }

        savedJobRepository.deleteById(savedJobId);
        return true;
    }

    public Optional<List<SavedJobResponseDto>> getSavedJobsByUserId(Integer userId) {
        if (!userRepository.existsById(userId)) {
            return Optional.empty();
        }

        List<SavedJobResponseDto> savedJobs = savedJobRepository.findByUser_UserId(userId)
                .stream()
                .map(this::mapToSavedJobResponseDto)
                .toList();

        return Optional.of(savedJobs);
    }

    private SavedJobResponseDto mapToSavedJobResponseDto(SavedJob savedJob) {
        SavedJobResponseDto dto = new SavedJobResponseDto();

        dto.setSavedJobId(savedJob.getSavedJobId());
        dto.setSavedAt(savedJob.getSavedAt());

        if (savedJob.getUser() != null) {
            User user = savedJob.getUser();

            dto.setUserId(user.getUserId());
            dto.setUserName(user.getName());
            dto.setUserEmail(user.getEmail());
        }

        if (savedJob.getJobPosting() != null) {
            JobPosting jobPosting = savedJob.getJobPosting();

            dto.setJobId(jobPosting.getJobId());
            dto.setJobTitle(jobPosting.getTitle());
            dto.setJobLocation(jobPosting.getLocation());
            dto.setSalaryRange(jobPosting.getSalaryRange());

            if (jobPosting.getEmployer() != null) {
                dto.setEmployerId(jobPosting.getEmployer().getUserId());
                dto.setEmployerName(jobPosting.getEmployer().getName());
            }
        }

        return dto;
    }
}