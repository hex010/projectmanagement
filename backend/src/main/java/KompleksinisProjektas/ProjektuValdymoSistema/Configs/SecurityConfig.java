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
                        .requestMatchers("/api/v1/project/create").hasAuthority(Role.Team_leader.name())
                        .anyRequest().authenticated()
                )
                .addFilterBefore(corsFilter, ChannelProcessingFilter.class)
                .addFilterBefore(customAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(filterChainExceptionHandler, LogoutFilter.class);

        return http.build();
    }

}
