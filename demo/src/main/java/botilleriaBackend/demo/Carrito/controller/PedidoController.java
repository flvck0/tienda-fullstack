package botilleriaBackend.demo.Carrito.controller;



import botilleriaBackend.demo.Carrito.model.Pedido;
import botilleriaBackend.demo.Carrito.repository.PedidosRepository;
import botilleriaBackend.demo.Productos.controller.ProductoController;
import botilleriaBackend.demo.Productos.model.Producto;
import botilleriaBackend.demo.Productos.repository.ProductoRepository;
import botilleriaBackend.demo.Usuarios.controller.AuthController;
import botilleriaBackend.demo.Usuarios.model.Usuario;
import botilleriaBackend.demo.Usuarios.repository.UsuarioRepository;
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
public class PedidoController {

    @Autowired
    private PedidosRepository pedidoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private ProductoRepository productoRepository;

    // 💡 Obtener Pedido por ID con HATEOAS
    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<Pedido>> obtenerPedidoPorId(@PathVariable Long id) {
        return pedidoRepository.findById(id)
                .map(pedido -> {
                    // Enlace a sí mismo
                    EntityModel<Pedido> model = EntityModel.of(pedido,
                            linkTo(methodOn(PedidoController.class).obtenerPedidoPorId(id)).withSelfRel());

                    // Enlace al usuario (si existe el controlador de usuario)
                    if (pedido.getUsuario() != null) {
                        model.add(linkTo(methodOn(AuthController.class)
                                .obtenerUsuario(pedido.getUsuario().getId())).withRel("usuario"));
                    }

                    // Enlaces a los productos dentro del detalle (opcional pero útil)
                    pedido.getDetalles().forEach(detalle -> {
                        model.add(linkTo(methodOn(ProductoController.class)
                                .obtenerProductoPorId(detalle.getProducto().getId()))
                                .withRel("producto-detalle-" + detalle.getId()));
                    });

                    return new ResponseEntity<>(model, HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // 💡 Crear Pedido (Devuelve EntityModel)
    @PostMapping
    public ResponseEntity<?> crearPedido(@RequestBody Pedido nuevoPedido) {
        // ... (Lógica de validación de usuario y stock igual que antes) ...
        // Asumimos validaciones pasadas para abreviar

        Optional<Usuario> usuarioOpt = usuarioRepository.findById(nuevoPedido.getUsuario().getId());
        if (usuarioOpt.isEmpty()) return new ResponseEntity<>("Usuario no encontrado", HttpStatus.NOT_FOUND);

        nuevoPedido.setUsuario(usuarioOpt.get());
        double total = 0.0;

        for (var detalle : nuevoPedido.getDetalles()) {
            Optional<Producto> pOpt = productoRepository.findById(detalle.getProducto().getId());
            if (pOpt.isEmpty()) return new ResponseEntity<>("Producto no encontrado", HttpStatus.BAD_REQUEST);

            Producto p = pOpt.get();
            if (detalle.getCantidad() > p.getStock()) return new ResponseEntity<>("Sin stock: " + p.getNombre(), HttpStatus.BAD_REQUEST);

            // Actualizar stock
            p.setStock(p.getStock() - detalle.getCantidad());
            productoRepository.save(p);

            detalle.setPrecioUnitario(p.getPrecio());
            detalle.setProducto(p);
            detalle.setPedido(nuevoPedido);
            total += detalle.getCantidad() * detalle.getPrecioUnitario();
        }

        nuevoPedido.setTotal(total);
        nuevoPedido.setFechaPedido(new Date());

        Pedido pedidoGuardado = pedidoRepository.save(nuevoPedido);

        // Retornar con HATEOAS
        EntityModel<Pedido> model = EntityModel.of(pedidoGuardado,
                linkTo(methodOn(PedidoController.class).obtenerPedidoPorId(pedidoGuardado.getId())).withSelfRel(),
                linkTo(methodOn(AuthController.class).obtenerUsuario(pedidoGuardado.getUsuario().getId())).withRel("usuario"));

        return new ResponseEntity<>(model, HttpStatus.CREATED);
    }

    // 💡 Obtener pedidos de un usuario específico
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<CollectionModel<EntityModel<Pedido>>> obtenerPedidosPorUsuario(@PathVariable Long usuarioId) {
        // En un repositorio real: List<Pedido> pedidos = pedidoRepository.findByUsuarioId(usuarioId);
        // Aquí simulamos trayendo todos y filtrando (ineficiente, mejor agregar método al repo)
        List<EntityModel<Pedido>> pedidos = pedidoRepository.findAll().stream()
                .filter(p -> p.getUsuario().getId().equals(usuarioId))
                .map(pedido -> EntityModel.of(pedido,
                        linkTo(methodOn(PedidoController.class).obtenerPedidoPorId(pedido.getId())).withSelfRel()))
                .collect(Collectors.toList());

        return new ResponseEntity<>(CollectionModel.of(pedidos,
                linkTo(methodOn(PedidoController.class).obtenerPedidosPorUsuario(usuarioId)).withSelfRel()), HttpStatus.OK);
    }



}