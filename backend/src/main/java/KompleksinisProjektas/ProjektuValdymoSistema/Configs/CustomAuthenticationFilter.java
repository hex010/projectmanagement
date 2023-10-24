package KompleksinisProjektas.ProjektuValdymoSistema.Configs;

import KompleksinisProjektas.ProjektuValdymoSistema.Exceptions.UserDoesNotExistException;
import KompleksinisProjektas.ProjektuValdymoSistema.Exceptions.UserNotLoggedException;
import KompleksinisProjektas.ProjektuValdymoSistema.Model.User;
import KompleksinisProjektas.ProjektuValdymoSistema.Service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationFilter extends OncePerRequestFilter {
    private final UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws IOException, ServletException {
        String email = request.getHeader("Email");
        String password = request.getHeader("Password");

        if(email == null || password == null) {
            filterChain.doFilter(request, response);
            return;
        }

        User user = userService.findUserByEmail(email);

        if(user == null) {
            throw new UserDoesNotExistException("Vartotojo prisijungimo duomenys neteisingi.");
        }
        if(!user.getPassword().equals(password)) {
            throw new UserDoesNotExistException("Vartotojo prisijungimo duomenys neteisingi.");
        }

        String userRole = user.getRole().toString();

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(userRole));

        Authentication authentication = new UsernamePasswordAuthenticationToken(email, password, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }
}