package botilleriaBackend.demo.Carrito.controller;

import botilleriaBackend.demo.Carrito.model.Pedido;
import botilleriaBackend.demo.Carrito.repository.PedidosRepository;
import botilleriaBackend.demo.Productos.controller.ProductoController;
import botilleriaBackend.demo.Productos.model.Producto;
import botilleriaBackend.demo.Productos.repository.ProductoRepository;
import botilleriaBackend.demo.Usuarios.controller.AuthController;
import botilleriaBackend.demo.Usuarios.model.Usuario;
import botilleriaBackend.demo.Usuarios.repository.UsuarioRepository;
import jakarta.transaction.Transactional; // 👈 Importante para la seguridad de datos
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = "*") // 👈 MODO ABIERTO: Soluciona el 'Failed to fetch'
public class PedidoController {

    @Autowired
    private PedidosRepository pedidoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private ProductoRepository productoRepository;

    // Obtener Pedido por ID
    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<Pedido>> obtenerPedidoPorId(@PathVariable Long id) {
        return pedidoRepository.findById(id)
                .map(pedido -> {
                    EntityModel<Pedido> model = EntityModel.of(pedido,
                            linkTo(methodOn(PedidoController.class).obtenerPedidoPorId(id)).withSelfRel());
                    return new ResponseEntity<>(model, HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // 🛒 CREAR PEDIDO (COMPRA)
    // @Transactional: Si algo falla a la mitad, se cancela todo y no se descuenta stock por error.
    @PostMapping
    @Transactional
    public ResponseEntity<?> crearPedido(@RequestBody Pedido nuevoPedido) {

        // 1. Validar que el usuario exista
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(nuevoPedido.getUsuario().getId());
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: Usuario no encontrado.");
        }

        nuevoPedido.setUsuario(usuarioOpt.get());
        double total = 0.0;

        // 2. Procesar cada producto del carrito
        for (var detalle : nuevoPedido.getDetalles()) {
            // Buscar el producto en la BD
            Optional<Producto> pOpt = productoRepository.findById(detalle.getProducto().getId());

            if (pOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Error: Producto no encontrado (ID: " + detalle.getProducto().getId() + ")");
            }

            Producto p = pOpt.get();

            // 3. VALIDAR STOCK
            if (detalle.getCantidad() > p.getStock()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Sin stock suficiente para: " + p.getNombre() + ". Quedan: " + p.getStock());
            }

            // 4. DESCONTAR STOCK
            p.setStock(p.getStock() - detalle.getCantidad());
            productoRepository.save(p); // Guardamos el nuevo stock

            // Configurar el detalle del pedido
            detalle.setPrecioUnitario(p.getPrecio());
            detalle.setProducto(p);
            detalle.setPedido(nuevoPedido); // Relacionar detalle con pedido padre

            total += detalle.getCantidad() * detalle.getPrecioUnitario();
        }

        // 5. Guardar el pedido final
        nuevoPedido.setTotal(total);
        nuevoPedido.setFechaPedido(new Date());

        Pedido pedidoGuardado = pedidoRepository.save(nuevoPedido);

        // Retornar éxito con JSON
        EntityModel<Pedido> model = EntityModel.of(pedidoGuardado,
                linkTo(methodOn(PedidoController.class).obtenerPedidoPorId(pedidoGuardado.getId())).withSelfRel());

        return new ResponseEntity<>(model, HttpStatus.CREATED);
    }

    // Obtener historial
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<CollectionModel<EntityModel<Pedido>>> obtenerPedidosPorUsuario(@PathVariable Long usuarioId) {
        List<EntityModel<Pedido>> pedidos = pedidoRepository.findAll().stream()
                .filter(p -> p.getUsuario().getId().equals(usuarioId))
                .map(pedido -> EntityModel.of(pedido,
                        linkTo(methodOn(PedidoController.class).obtenerPedidoPorId(pedido.getId())).withSelfRel()))
                .collect(Collectors.toList());

        return new ResponseEntity<>(CollectionModel.of(pedidos,
                linkTo(methodOn(PedidoController.class).obtenerPedidosPorUsuario(usuarioId)).withSelfRel()), HttpStatus.OK);
    }
}