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

    // Relación con el Usuario (Muchos pedidos pueden ser de un usuario)
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario; // El usuario que realiza el pedido

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaPedido = new Date();

    private String estado = "PENDIENTE"; // E.g., PENDIENTE, ENVIADO, COMPLETADO

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetallePedido> detalles; // Los productos dentro del pedido

    // Campo para calcular el total
    private double total;
}