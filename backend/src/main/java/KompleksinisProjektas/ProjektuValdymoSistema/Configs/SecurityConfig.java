package KompleksinisProjektas.ProjektuValdymoSistema.Configs;

import KompleksinisProjektas.ProjektuValdymoSistema.Model.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.channel.ChannelProcessingFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig {
    private final CustomAuthenticationFilter customAuthenticationFilter;
    private final FilterChainExceptionHandler filterChainExceptionHandler;
    private final CorsFilter corsFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/login").permitAll()
                        .requestMatchers("/api/v1/project/create").hasAuthority(Role.KOMANDOS_VADOVAS.name())
                        .requestMatchers("/api/v1/project/addProjectDocument").hasAuthority(Role.KOMANDOS_VADOVAS.name())
                        .requestMatchers("/api/v1/project/{projectId}/addUsers").hasAuthority(Role.KOMANDOS_VADOVAS.name())
                        .requestMatchers("/api/v1/user/add").hasAuthority(Role.DIREKTORIUS.name())
                        .requestMatchers("/api/v1/task/add").hasAuthority(Role.KOMANDOS_VADOVAS.name())
                        .requestMatchers("/api/v1/task/uploadProjectDocument/{taskId}").hasAuthority(Role.KOMANDOS_VADOVAS.name())
                        .requestMatchers("/api/v1/user/getAllTeamMembersNotInProject/{projectID}").hasAuthority(Role.KOMANDOS_VADOVAS.name())
                        .requestMatchers("/api/v1/project/finish").hasAuthority(Role.KOMANDOS_VADOVAS.name())
                        .requestMatchers("/api/v1/project/{projectId}/addUsers").hasAuthority(Role.KOMANDOS_VADOVAS.name())
                        .requestMatchers("/api/v1/user/update").hasAuthority(Role.DIREKTORIUS.name())
                        .requestMatchers("/api/v1/user/getAll").hasAuthority(Role.DIREKTORIUS.name())
                        .requestMatchers("/api/v1/project/get/statistics/{projectId}").hasAnyAuthority(Role.KOMANDOS_VADOVAS.name(), Role.DIREKTORIUS.name())
                        .requestMatchers("/api/v1/project/get/report/{projectId}").hasAuthority(Role.DIREKTORIUS.name())
                        .anyRequest().authenticated()
                )
                .addFilterBefore(corsFilter, ChannelProcessingFilter.class)
                .addFilterBefore(customAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(filterChainExceptionHandler, LogoutFilter.class);

        return http.build();
    }

}
