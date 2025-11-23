package botilleriaBackend.demo.controller;

import botilleriaBackend.demo.Carrito.controller.PedidoController;
import botilleriaBackend.demo.Carrito.model.DetallePedido;
import botilleriaBackend.demo.Carrito.model.Pedido;
import botilleriaBackend.demo.Carrito.repository.PedidosRepository;
import botilleriaBackend.demo.Productos.model.Producto;
import botilleriaBackend.demo.Productos.repository.ProductoRepository;
import botilleriaBackend.demo.Usuarios.model.Usuario;
import botilleriaBackend.demo.Usuarios.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PedidoControllerTest {

    @Mock private PedidosRepository pedidoRepository;
    @Mock private UsuarioRepository usuarioRepository;
    @Mock private ProductoRepository productoRepository;

    @InjectMocks
    private PedidoController pedidoController;

    @Test
    void crearPedido_FlujoExitoso() {
        // 1. Preparar Datos (Usuario y Producto existen)
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("test@email.com");

        Producto producto = new Producto();
        producto.setId(10L);
        producto.setPrecio(1000.0);
        producto.setStock(50);
        producto.setNombre("Cerveza");

        // Crear Pedido de entrada
        Pedido pedidoInput = new Pedido();
        pedidoInput.setUsuario(usuario);

        DetallePedido detalle = new DetallePedido();
        detalle.setProducto(producto);
        detalle.setCantidad(2); // Compra 2 unidades

        List<DetallePedido> listaDetalles = new ArrayList<>();
        listaDetalles.add(detalle);
        pedidoInput.setDetalles(listaDetalles);

        // 2. Configurar Mocks (Simular BD)
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(productoRepository.findById(10L)).thenReturn(Optional.of(producto));

        // Cuando guarde, devuelve el mismo pedido pero con ID
        when(pedidoRepository.save(any(Pedido.class))).thenAnswer(invocation -> {
            Pedido p = invocation.getArgument(0);
            p.setId(999L); // ID simulado de la BD
            return p;
        });

        // 3. Ejecutar
        ResponseEntity<?> respuesta = pedidoController.crearPedido(pedidoInput);

        // 4. Verificar (Asserts)
        assertEquals(HttpStatus.CREATED, respuesta.getStatusCode());

        // Casteamos el body para poder leerlo (porque es EntityModel<?>)
        EntityModel<Pedido> body = (EntityModel<Pedido>) respuesta.getBody();
        assertNotNull(body);
        assertEquals(2000.0, body.getContent().getTotal()); // 1000 * 2 = 2000

        // Verificar que se restó stock (50 - 2 = 48)
        assertEquals(48, producto.getStock());
    }

    @Test
    void crearPedido_FallaSiUsuarioNoExiste() {
        Pedido pedido = new Pedido();
        Usuario userFalso = new Usuario();
        userFalso.setId(99L);
        pedido.setUsuario(userFalso);

        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        ResponseEntity<?> respuesta = pedidoController.crearPedido(pedido);

        assertEquals(HttpStatus.NOT_FOUND, respuesta.getStatusCode());
    }
}