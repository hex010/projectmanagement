package KompleksinisProjektas.ProjektuValdymoSistema.Controller;

import KompleksinisProjektas.ProjektuValdymoSistema.Model.TaskStatus;
import KompleksinisProjektas.ProjektuValdymoSistema.Service.UserService;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/getAllTeamMembersNotInProject/{projectID}")
    public ResponseEntity<List<UserDTO>> getAllTeamMembersNotInProject(@PathVariable int projectID) {
        List<UserDTO> teamMembersNotInProject = userService.getAllTeamMembersNotInProject(projectID);
        return ResponseEntity.ok(teamMembersNotInProject);
    }

    @PostMapping("/add")
    public ResponseEntity<UserAddRequestDTO> addNewUser(@RequestBody UserAddRequestFDTO registerRequest) {
        UserAddRequestDTO userAddRequestDTO = userService.addUser(registerRequest);

        return ResponseEntity.ok(userAddRequestDTO);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<EditUserDTO>> getAllUsers() {
        List<EditUserDTO> allUsers = userService.getAllUsers();
        return ResponseEntity.ok(allUsers);
    }

    @PutMapping("/update")
    public ResponseEntity<EditUserDTO> updateUser(@RequestBody EditUserDTO editUserDTO) {
        EditUserDTO updatedUser = userService.updateUser(editUserDTO);
        return ResponseEntity.ok(updatedUser);
    }
}
