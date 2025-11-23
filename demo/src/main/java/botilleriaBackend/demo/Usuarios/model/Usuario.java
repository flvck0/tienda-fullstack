package botilleriaBackend.demo.Usuarios.model;

import botilleriaBackend.demo.Carrito.model.Pedido;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails; // ⚠️ Importante

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario implements UserDetails { // ⚠️ AGREGAR: implements UserDetails

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String nombre;
    private String direccion;

    // Relación con Pedidos
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Pedido> pedidos;

    @Enumerated(EnumType.STRING)
    private Rol rol; // Ahora ya reconocerá el Enum Rol que creamos arriba

    // --- Métodos requeridos por UserDetails ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Si el rol es nulo, asignamos "USER" por defecto
        return List.of(new SimpleGrantedAuthority(rol != null ? rol.name() : "USER"));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }
}