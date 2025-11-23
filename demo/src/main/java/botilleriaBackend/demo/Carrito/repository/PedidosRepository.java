package botilleriaBackend.demo.Carrito.repository;

import botilleriaBackend.demo.Carrito.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidosRepository extends JpaRepository<Pedido, Long> {
    // Puedes añadir métodos para buscar pedidos por usuario, estado, etc.
}
