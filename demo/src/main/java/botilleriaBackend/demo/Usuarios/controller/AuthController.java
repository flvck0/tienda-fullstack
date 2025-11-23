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
@RequiredArgsConstructor// Ruta base
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtService jwtService; // 💡 Inyectamos el servicio de tokens

    @Autowired
    private PasswordEncoder passwordEncoder; // 💡 Para encriptar contraseñas

    // 1. REGISTRO
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            return new ResponseEntity<>("El email ya está registrado.", HttpStatus.BAD_REQUEST);
        }

        // Encriptamos la contraseña antes de guardar
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        // Asignamos ROL por defecto si no viene
        if (usuario.getRol() == null) {
            usuario.setRol(Rol.USER);
        }

        usuarioRepository.save(usuario);

        // Generamos el token inmediatamente al registrarse (opcional, o puedes pedir que se loguee)
        String token = jwtService.generateToken(usuario);

        return new ResponseEntity<>(Map.of("token", token), HttpStatus.CREATED);
    }

    // 2. LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Usuario loginRequest) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(loginRequest.getEmail());

        // Verificamos si existe y si la contraseña coincide (usando el encoder)
        if (usuarioOpt.isPresent() && passwordEncoder.matches(loginRequest.getPassword(), usuarioOpt.get().getPassword())) {

            // 💡 AQUÍ GENERAMOS EL TOKEN
            String token = jwtService.generateToken(usuarioOpt.get());

            // Devolvemos un JSON simple con el token
            Map<String, String> response = new HashMap<>();
            response.put("token", token);

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

    // 4. ACTUALIZAR USUARIO (PUT) - 💡 Solicitado
    @PutMapping("/{id}")
    public ResponseEntity<EntityModel<Usuario>> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario detalles) {
        return usuarioRepository.findById(id)
                .map(usuarioExistente -> {
                    usuarioExistente.setNombre(detalles.getNombre());
                    usuarioExistente.setDireccion(detalles.getDireccion());
                    // Solo actualizamos email/password si vienen en el body
                    if(detalles.getEmail() != null) usuarioExistente.setEmail(detalles.getEmail());
                    if(detalles.getPassword() != null) usuarioExistente.setPassword(detalles.getPassword());

                    Usuario actualizado = usuarioRepository.save(usuarioExistente);
                    return new ResponseEntity<>(addLinks(actualizado), HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // 5. ELIMINAR USUARIO (DELETE) - 💡 Solicitado
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
                linkTo(methodOn(AuthController.class).obtenerUsuario(usuario.getId())).withSelfRel(),
                linkTo(methodOn(AuthController.class).eliminarUsuario(usuario.getId())).withRel("delete"),
                // Enlace a sus pedidos (debes tener el PedidoController listo)
                linkTo(methodOn(PedidoController.class).obtenerPedidosPorUsuario(usuario.getId())).withRel("mis-pedidos")
        );
    }
}