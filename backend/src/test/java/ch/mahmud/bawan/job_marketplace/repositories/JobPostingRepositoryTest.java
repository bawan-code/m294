package ch.mahmud.bawan.job_marketplace.repositories;

import ch.mahmud.bawan.job_marketplace.models.JobPosting;
import ch.mahmud.bawan.job_marketplace.models.Role;
import ch.mahmud.bawan.job_marketplace.models.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class JobPostingRepositoryTest {

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void create_shouldSaveJobPosting() {
        User employer = createAndSaveEmployer();

        JobPosting jobPosting = new JobPosting();
        jobPosting.setTitle("Java Developer");
        jobPosting.setDescription("Spring Boot backend developer");
        jobPosting.setLocation("Basel");
        jobPosting.setSalaryRange("80000-100000 CHF");
        jobPosting.setEmployer(employer);

        JobPosting savedJobPosting = jobPostingRepository.save(jobPosting);

        assertThat(savedJobPosting.getJobId()).isNotNull();
        assertThat(savedJobPosting.getTitle()).isEqualTo("Java Developer");
        assertThat(savedJobPosting.getDescription()).isEqualTo("Spring Boot backend developer");
        assertThat(savedJobPosting.getLocation()).isEqualTo("Basel");
        assertThat(savedJobPosting.getSalaryRange()).isEqualTo("80000-100000 CHF");
        assertThat(savedJobPosting.getEmployer().getUserId()).isEqualTo(employer.getUserId());
        assertThat(savedJobPosting.getCreatedAt()).isNotNull();
        assertThat(savedJobPosting.getUpdatedAt()).isNotNull();
    }

    @Test
    void read_shouldFindJobPostingById() {
        User employer = createAndSaveEmployer();
        JobPosting savedJobPosting = createAndSaveJobPosting(employer);

        Optional<JobPosting> result = jobPostingRepository.findById(savedJobPosting.getJobId());

        assertThat(result).isPresent();
        assertThat(result.get().getJobId()).isEqualTo(savedJobPosting.getJobId());
        assertThat(result.get().getTitle()).isEqualTo("Java Developer");
        assertThat(result.get().getEmployer().getEmail()).isEqualTo("employer@example.com");
    }

    @Test
    void read_shouldFindAllJobPostings() {
        User employer = createAndSaveEmployer();

        createAndSaveJobPosting(employer);

        JobPosting secondJobPosting = new JobPosting();
        secondJobPosting.setTitle("Frontend Developer");
        secondJobPosting.setDescription("Angular frontend developer");
        secondJobPosting.setLocation("Zürich");
        secondJobPosting.setSalaryRange("75000-95000 CHF");
        secondJobPosting.setEmployer(employer);

        jobPostingRepository.save(secondJobPosting);

        List<JobPosting> result = jobPostingRepository.findAll();

        assertThat(result).hasSize(2);
        assertThat(result)
                .extracting(JobPosting::getTitle)
                .containsExactlyInAnyOrder("Java Developer", "Frontend Developer");
    }

    @Test
    void update_shouldUpdateJobPosting() {
        User employer = createAndSaveEmployer();
        JobPosting savedJobPosting = createAndSaveJobPosting(employer);

        savedJobPosting.setTitle("Senior Java Developer");
        savedJobPosting.setDescription("Updated backend role");
        savedJobPosting.setLocation("Bern");
        savedJobPosting.setSalaryRange("100000-120000 CHF");

        JobPosting updatedJobPosting = jobPostingRepository.save(savedJobPosting);

        assertThat(updatedJobPosting.getJobId()).isEqualTo(savedJobPosting.getJobId());
        assertThat(updatedJobPosting.getTitle()).isEqualTo("Senior Java Developer");
        assertThat(updatedJobPosting.getDescription()).isEqualTo("Updated backend role");
        assertThat(updatedJobPosting.getLocation()).isEqualTo("Bern");
        assertThat(updatedJobPosting.getSalaryRange()).isEqualTo("100000-120000 CHF");
    }

    @Test
    void delete_shouldDeleteJobPosting() {
        User employer = createAndSaveEmployer();
        JobPosting savedJobPosting = createAndSaveJobPosting(employer);

        jobPostingRepository.deleteById(savedJobPosting.getJobId());

        Optional<JobPosting> result = jobPostingRepository.findById(savedJobPosting.getJobId());

        assertThat(result).isEmpty();
    }

    @Test
    void customRead_shouldFindJobPostingsByEmployerUserId() {
        User employer = createAndSaveEmployer();
        createAndSaveJobPosting(employer);

        List<JobPosting> result = jobPostingRepository.findByEmployer_UserId(employer.getUserId());

        assertThat(result).hasSize(1);
        assertThat(result.getFirst().getTitle()).isEqualTo("Java Developer");
        assertThat(result.getFirst().getEmployer().getUserId()).isEqualTo(employer.getUserId());
    }

    private User createAndSaveEmployer() {
        User employer = new User();
        employer.setKeycloakId("test-keycloak-id-1");
        employer.setName("Test Employer");
        employer.setEmail("employer@example.com");
        employer.setRole(Role.EMPLOYER);

        return userRepository.save(employer);
    }

    private JobPosting createAndSaveJobPosting(User employer) {
        JobPosting jobPosting = new JobPosting();
        jobPosting.setTitle("Java Developer");
        jobPosting.setDescription("Spring Boot backend developer");
        jobPosting.setLocation("Basel");
        jobPosting.setSalaryRange("80000-100000 CHF");
        jobPosting.setEmployer(employer);

        return jobPostingRepository.save(jobPosting);
    }
}