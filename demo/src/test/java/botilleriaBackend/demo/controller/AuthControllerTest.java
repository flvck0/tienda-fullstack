package botilleriaBackend.demo.controller;

import botilleriaBackend.demo.Usuarios.controller.AuthController;
import botilleriaBackend.demo.Usuarios.model.Rol;
import botilleriaBackend.demo.Usuarios.model.Usuario;
import botilleriaBackend.demo.Usuarios.repository.UsuarioRepository;
import botilleriaBackend.demo.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// Si usas PasswordEncoder en tu controller:
// import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    // Si tu AuthController usa PasswordEncoder, descomenta esto y el import arriba
    // @Mock
    // private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService; // Simula la creación de tokens

    @InjectMocks
    private AuthController authController;

    @Test
    void registerUser_DebeCrearUsuario() {
        // Arrange
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setEmail("nuevo@test.com");
        nuevoUsuario.setPassword("123456");
        nuevoUsuario.setRol(Rol.USER);

        // Simulamos que el email NO existe
        when(usuarioRepository.findByEmail("nuevo@test.com")).thenReturn(Optional.empty());

        // Simulamos guardado (devuelve usuario con ID)
        Usuario usuarioGuardado = new Usuario();
        usuarioGuardado.setId(1L);
        usuarioGuardado.setEmail("nuevo@test.com");

        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioGuardado);

        // Act
        ResponseEntity<?> respuesta = authController.registerUser(nuevoUsuario);

        // Assert
        assertEquals(HttpStatus.CREATED, respuesta.getStatusCode());
    }

    @Test
    void loginUser_CredencialesCorrectas_RetornaToken() {
        // Arrange
        Usuario loginRequest = new Usuario();
        loginRequest.setEmail("admin@test.com");
        loginRequest.setPassword("secret");

        Usuario usuarioEnBD = new Usuario();
        usuarioEnBD.setId(1L);
        usuarioEnBD.setEmail("admin@test.com");
        usuarioEnBD.setPassword("secret"); // En un caso real esto estaría hasheado
        usuarioEnBD.setRol(Rol.ADMIN);

        when(usuarioRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(usuarioEnBD));

        // Act
        ResponseEntity<?> respuesta = authController.loginUser(loginRequest);

        // Assert
        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
    }
}