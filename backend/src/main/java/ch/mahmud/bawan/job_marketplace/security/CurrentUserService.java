package ch.mahmud.bawan.job_marketplace.security;

import ch.mahmud.bawan.job_marketplace.models.User;
import ch.mahmud.bawan.job_marketplace.repositories.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CurrentUserService {

    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Löst den angemeldeten Benutzer aus dem JWT auf.
     * Der Subject-Claim des Tokens entspricht der Keycloak-ID des lokalen Benutzers.
     */
    public Optional<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!(authentication instanceof JwtAuthenticationToken jwtAuthentication)) {
            return Optional.empty();
        }

        String keycloakId = jwtAuthentication.getToken().getSubject();

        if (keycloakId == null || keycloakId.isBlank()) {
            return Optional.empty();
        }

        return userRepository.findByKeycloakId(keycloakId);
    }
}
