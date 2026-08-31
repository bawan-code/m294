package ch.mahmud.bawan.job_marketplace.config;

import ch.mahmud.bawan.job_marketplace.security.JwtAuthConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthConverter jwtAuthConverter;

    private static final String[] AUTH_WHITELIST = {
            "/",
            "/swagger-ui.html",
            "/swagger-ui/**",
            "/v3/api-docs",
            "/v3/api-docs/**",
            "/v3/api-docs.yaml"
    };

    public SecurityConfig(JwtAuthConverter jwtAuthConverter) {
        this.jwtAuthConverter = jwtAuthConverter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
        requestHandler.setCsrfRequestAttributeName(null);
        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        // Swagger / OpenAPI
                        .requestMatchers(AUTH_WHITELIST).permitAll()

                        // Auth
                        .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()

                        // Public job browsing
                        .requestMatchers(HttpMethod.GET, "/api/job-postings").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/job-postings/*").permitAll()

                        // Admin
                        .requestMatchers(HttpMethod.GET, "/api/users").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/job-applications").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/saved-jobs").hasRole("ADMIN")

                        // User profile access
                        .requestMatchers(HttpMethod.GET, "/api/users/**").hasAnyRole("ADMIN", "EMPLOYER", "JOB_SEEKER")
                        .requestMatchers(HttpMethod.PUT, "/api/users/**").hasAnyRole("ADMIN", "JOB_SEEKER", "EMPLOYER")

                        // Job postings
                        .requestMatchers(HttpMethod.POST, "/api/job-postings").hasAnyRole("EMPLOYER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/job-postings/**").hasAnyRole("EMPLOYER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/job-postings/**").hasAnyRole("EMPLOYER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/users/*/job-postings").hasAnyRole("EMPLOYER", "ADMIN")

                        // Job applications
                        .requestMatchers(HttpMethod.POST, "/api/job-applications").hasRole("JOB_SEEKER")
                        .requestMatchers(HttpMethod.GET, "/api/job-applications/*").hasAnyRole("ADMIN", "EMPLOYER", "JOB_SEEKER")
                        .requestMatchers(HttpMethod.PATCH, "/api/job-applications/*/status").hasAnyRole("EMPLOYER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/job-applications/*").hasAnyRole("JOB_SEEKER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/users/*/job-applications").hasAnyRole("JOB_SEEKER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/job-postings/*/job-applications").hasAnyRole("EMPLOYER", "ADMIN")

                        // Saved jobs
                        .requestMatchers(HttpMethod.POST, "/api/saved-jobs").hasRole("JOB_SEEKER")
                        .requestMatchers(HttpMethod.GET, "/api/saved-jobs/*").hasAnyRole("JOB_SEEKER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/saved-jobs/*").hasAnyRole("JOB_SEEKER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/users/*/saved-jobs").hasAnyRole("JOB_SEEKER", "ADMIN")

                        // Fallback
                        .anyRequest().authenticated()
                )

                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .jwtAuthenticationConverter(jwtAuthConverter)
                        )
                )
                .cors(cors -> corsConfigurer());

        return http.build();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedMethods("HEAD", "GET", "PUT", "POST", "DELETE", "PATCH", "OPTIONS")
                        .allowedOrigins("http://localhost:4200")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}