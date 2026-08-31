package ch.mahmud.bawan.job_marketplace.services;

import ch.mahmud.bawan.job_marketplace.dtos.UserResponseDto;
import ch.mahmud.bawan.job_marketplace.dtos.UserUpdateRequestDto;
import ch.mahmud.bawan.job_marketplace.models.User;
import ch.mahmud.bawan.job_marketplace.repositories.UserRepository;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final Keycloak keycloak;

    @Value("${keycloak.realm}")
    private String realm;

    public UserService(UserRepository userRepository, Keycloak keycloak) {
        this.userRepository = userRepository;
        this.keycloak = keycloak;
    }

    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToUserResponseDto)
                .toList();
    }

    public Optional<UserResponseDto> getUserById(Integer userId) {
        return userRepository.findById(userId)
                .map(this::mapToUserResponseDto);
    }

    public Optional<UserResponseDto> updateUser(Integer userId, UserUpdateRequestDto request) {
        return userRepository.findById(userId)
                .map(existingUser -> {
                    updateUserInKeycloak(existingUser, request);

                    existingUser.setName(request.getName());
                    existingUser.setEmail(request.getEmail());

                    User savedUser = userRepository.save(existingUser);

                    return mapToUserResponseDto(savedUser);
                });
    }

    public boolean deleteUser(Integer userId) {
        if (!userRepository.existsById(userId)) {
            return false;
        }

        userRepository.deleteById(userId);
        return true;
    }

    private void updateUserInKeycloak(User existingUser, UserUpdateRequestDto request) {
        UserRepresentation keycloakUser = keycloak.realm(realm)
                .users()
                .get(existingUser.getKeycloakId())
                .toRepresentation();

        keycloakUser.setUsername(request.getEmail());
        keycloakUser.setEmail(request.getEmail());
        keycloakUser.setFirstName(request.getName());
        keycloakUser.setLastName("-");
        keycloakUser.setEmailVerified(true);
        keycloakUser.setEnabled(true);

        keycloak.realm(realm)
                .users()
                .get(existingUser.getKeycloakId())
                .update(keycloakUser);
    }

    private UserResponseDto mapToUserResponseDto(User user) {
        UserResponseDto dto = new UserResponseDto();

        dto.setUserId(user.getUserId());
        dto.setKeycloakId(user.getKeycloakId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setCreatedAt(user.getCreatedAt());

        return dto;
    }
}