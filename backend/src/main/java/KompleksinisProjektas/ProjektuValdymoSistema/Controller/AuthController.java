package KompleksinisProjektas.ProjektuValdymoSistema.Controller;

import KompleksinisProjektas.ProjektuValdymoSistema.Service.AuthService;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.LoginRequestDTO;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.LoginRequestFDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor

public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginRequestDTO> loginUser(@RequestBody LoginRequestFDTO loginRequest) {
        LoginRequestDTO loginRequestDTO = authService.findUserAccount(loginRequest);

        return ResponseEntity.ok(loginRequestDTO);
    }
}