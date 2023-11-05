package KompleksinisProjektas.ProjektuValdymoSistema.Controller;

import KompleksinisProjektas.ProjektuValdymoSistema.Service.UserService;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.UserAddRequestDTO;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.UserAddRequestFDTO;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.UserDTO;
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
}
