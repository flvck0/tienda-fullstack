package botilleriaBackend.demo.Usuarios.controller;

import botilleriaBackend.demo.Carrito.controller.PedidoController;
import botilleriaBackend.demo.Usuarios.model.Rol;
import botilleriaBackend.demo.Usuarios.model.Usuario;
import botilleriaBackend.demo.Usuarios.repository.UsuarioRepository;
import botilleriaBackend.demo.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // 👈 Permite la conexión desde React
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 1. REGISTRO
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Usuario usuario) {
        // Validación básica
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            return new ResponseEntity<>("El email ya está registrado.", HttpStatus.BAD_REQUEST);
        }

        // Encriptar contraseña
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        // Asignar Rol por defecto si no viene
        if (usuario.getRol() == null) {
            usuario.setRol(Rol.USER);
        }

        usuarioRepository.save(usuario);

        // Generar token para que entre directo
        String token = jwtService.generateToken(usuario);

        // Devolver token en formato JSON
        return new ResponseEntity<>(Map.of("token", token), HttpStatus.CREATED);
    }

    // 2. LOGIN (MODIFICADO para devolver ROL y DATOS)
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Usuario loginRequest) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(loginRequest.getEmail());

        if (usuarioOpt.isPresent() && passwordEncoder.matches(loginRequest.getPassword(), usuarioOpt.get().getPassword())) {

            // Generamos token
            String token = jwtService.generateToken(usuarioOpt.get());

            // 💡 MODIFICACIÓN CRÍTICA:
            // Devolvemos un Map<String, Object> para mandar token, rol, nombre e id.
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("email", usuarioOpt.get().getEmail());
            response.put("nombre", usuarioOpt.get().getNombre());
            response.put("id", usuarioOpt.get().getId());
            // Enviamos el ROL como String para que React sepa si redirigir a /admin
            response.put("role", usuarioOpt.get().getRol().toString());

            return new ResponseEntity<>(response, HttpStatus.OK);
        }

        return new ResponseEntity<>("Credenciales inválidas.", HttpStatus.UNAUTHORIZED);
    }

    // 3. OBTENER USUARIO (GET)
    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<Usuario>> obtenerUsuario(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(usuario -> new ResponseEntity<>(addLinks(usuario), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // 4. ELIMINAR USUARIO (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> eliminarUsuario(@PathVariable Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Método auxiliar para HATEOAS
    private EntityModel<Usuario> addLinks(Usuario usuario) {
        return EntityModel.of(usuario,
                linkTo(methodOn(AuthController.class).obtenerUsuario(usuario.getId())).withSelfRel());
    }
}