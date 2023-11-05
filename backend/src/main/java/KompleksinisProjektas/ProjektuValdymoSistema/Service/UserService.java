package KompleksinisProjektas.ProjektuValdymoSistema.Service;


import KompleksinisProjektas.ProjektuValdymoSistema.Exceptions.ProjectDoesNotExistException;
import KompleksinisProjektas.ProjektuValdymoSistema.Exceptions.UserAlreadyExistsException;
import KompleksinisProjektas.ProjektuValdymoSistema.Exceptions.UserDoesNotExistException;
import KompleksinisProjektas.ProjektuValdymoSistema.Model.Project;
import KompleksinisProjektas.ProjektuValdymoSistema.Model.Role;
import KompleksinisProjektas.ProjektuValdymoSistema.Model.User;
import KompleksinisProjektas.ProjektuValdymoSistema.Repository.ProjectRepository;
import KompleksinisProjektas.ProjektuValdymoSistema.Repository.UserRepository;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.UserAddRequestDTO;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.UserAddRequestFDTO;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.UserDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserDoesNotExistException("Naudotojas nerastas"));
    }

    public List<UserDTO> getAllTeamMembersNotInProject(int projectID) {
        Project project = projectRepository.findById(projectID)
                .orElseThrow(() -> new ProjectDoesNotExistException("Projektas neegzistuoja"));

        List<User> allUsers = userRepository.findAll();

        List<User> projectTeamMembers = project.getTeamMembers();

        List<UserDTO> teamMembersNotInProject = new ArrayList<>();

        for (User user : allUsers) {
            if (!projectTeamMembers.contains(user) && user.getRole().equals(Role.Team_member)) {
                teamMembersNotInProject.add(new UserDTO(user));
            }
        }

        return teamMembersNotInProject;
    }

    public UserAddRequestDTO addUser(UserAddRequestFDTO registerRequest) {
        Optional<User> existingUser = userRepository.findByEmail(registerRequest.getEmail());
        if (existingUser.isPresent()) {
            throw new UserAlreadyExistsException("Naudotojas jau egzistuoja sistemoje");
        }

        User user = new User(registerRequest);
        user = userRepository.save(user);
        return new UserAddRequestDTO(user.getId(), user.getEmail(), user.getPassword(), user.getFirstname(), user.getLastname(), user.getRole());
    }
}