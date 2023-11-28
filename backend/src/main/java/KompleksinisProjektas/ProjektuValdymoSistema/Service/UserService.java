package KompleksinisProjektas.ProjektuValdymoSistema.Service;


import KompleksinisProjektas.ProjektuValdymoSistema.Exceptions.ProjectDoesNotExistException;
import KompleksinisProjektas.ProjektuValdymoSistema.Exceptions.UserAlreadyExistsException;
import KompleksinisProjektas.ProjektuValdymoSistema.Exceptions.UserDoesNotExistException;
import KompleksinisProjektas.ProjektuValdymoSistema.Model.Project;
import KompleksinisProjektas.ProjektuValdymoSistema.Model.Role;
import KompleksinisProjektas.ProjektuValdymoSistema.Model.User;
import KompleksinisProjektas.ProjektuValdymoSistema.Repository.ProjectRepository;
import KompleksinisProjektas.ProjektuValdymoSistema.Repository.UserRepository;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.EditUserDTO;
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
            if (!projectTeamMembers.contains(user) && user.getRole().equals(Role.KOMANDOS_NARYS)) {
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

    public List<EditUserDTO> getAllUsers() {
        List<User> allUsers = userRepository.findAll();
        return allUsers.stream().map(EditUserDTO::new).toList();
    }

    public EditUserDTO updateUser(EditUserDTO editUserDTO) {
        Optional<User> existingUserOptional = userRepository.findById(editUserDTO.getId());
        Optional<User> existingUserByUpdatedEmailOptional = userRepository.findByEmail(editUserDTO.getEmail());

        if (!existingUserOptional.isPresent()) {
            throw new UserDoesNotExistException("Naudotojas nerastas duomenų bazėje.");
        }

        User existingUser = existingUserOptional.get();

        if (!existingUser.getEmail().equals(editUserDTO.getEmail()) && existingUserByUpdatedEmailOptional.isPresent()) {
            throw new UserAlreadyExistsException("Toks el. paštas jau užimtas.");
        }


        existingUser.setUpdateData(editUserDTO);
        existingUser = userRepository.save(existingUser);

        return new EditUserDTO(existingUser);
    }
}