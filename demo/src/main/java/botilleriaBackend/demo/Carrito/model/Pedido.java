package botilleriaBackend.demo.Carrito.model;

import botilleriaBackend.demo.Usuarios.model.Usuario;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "pedido")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaPedido = new Date();

    private String estado = "PENDIENTE";

    // Queremos ver los detalles en el JSON, así que NO ponemos @JsonIgnore aquí.
    // Pero SÍ lo pusimos en DetallePedido.java (en el campo 'pedido'), así que el ciclo se rompe.
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetallePedido> detalles;

    private double total;
}