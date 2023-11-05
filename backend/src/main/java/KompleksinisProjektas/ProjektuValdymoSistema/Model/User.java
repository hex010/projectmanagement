package KompleksinisProjektas.ProjektuValdymoSistema.Model;

import KompleksinisProjektas.ProjektuValdymoSistema.dtos.UserAddRequestFDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(unique=true, length = 70)
    private String email;

    private String password;
    @Column(length = 50)
    private String firstname;
    @Column(length = 50)
    private String lastname;
    private Role role;
    private boolean accountNonLocked;

    @ManyToMany(mappedBy = "teamMembers")
    private Set<Project> projects;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }


    public User(UserAddRequestFDTO registerRequest) {
        firstname =  registerRequest.getFirstname();
        lastname = registerRequest.getLastname();
        email = registerRequest.getEmail();
        password = registerRequest.getPassword();
        role = registerRequest.getRole();
    }
}