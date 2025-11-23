package botilleriaBackend.demo.controller;

import botilleriaBackend.demo.Productos.controller.ProductoController;
import botilleriaBackend.demo.Productos.model.Producto;
import botilleriaBackend.demo.Productos.repository.ProductoRepository;
import net.datafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductoControllerTest {

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private ProductoController productoController;

    private Faker faker;

    @BeforeEach
    void setUp() {
        faker = new Faker();
    }

    @Test
    void obtenerTodosLosProductos_DebeRetornarLista() {
        // Arrange
        Producto p1 = new Producto(1L, "Cerveza A", "Desc A", 1000.0, 10, null, null);
        Producto p2 = new Producto(2L, "Cerveza B", "Desc B", 2000.0, 20, null, null);

        when(productoRepository.findAll()).thenReturn(Arrays.asList(p1, p2));

        // Act
        ResponseEntity<CollectionModel<EntityModel<Producto>>> respuesta = productoController.obtenerTodosLosProductos();

        // Assert
        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertNotNull(respuesta.getBody());
        assertEquals(2, respuesta.getBody().getContent().size());
    }

    @Test
    void obtenerProductoPorId_DebeRetornarProducto() {
        // Arrange
        Long id = 1L;
        Producto producto = new Producto(id, "Vino", "Tinto", 5000.0, 5, null, null);
        when(productoRepository.findById(id)).thenReturn(Optional.of(producto));

        // Act
        ResponseEntity<EntityModel<Producto>> respuesta = productoController.obtenerProductoPorId(id);

        // Assert
        assertEquals(HttpStatus.OK, respuesta.getStatusCode());
        assertEquals("Vino", respuesta.getBody().getContent().getNombre());
    }

    @Test
    void crearProducto_DebeGuardar() {
        // Arrange
        Producto nuevo = new Producto(null, "Pisco", "Chileno", 7000.0, 10, null, null);
        Producto guardado = new Producto(1L, "Pisco", "Chileno", 7000.0, 10, null, null); // Simula ID generado

        when(productoRepository.save(any(Producto.class))).thenReturn(guardado);

        // Act
        ResponseEntity<EntityModel<Producto>> respuesta = productoController.crearProducto(nuevo);

        // Assert
        assertEquals(HttpStatus.CREATED, respuesta.getStatusCode());
        assertEquals(1L, respuesta.getBody().getContent().getId());
    }

    @Test
    void eliminarProducto_DebeRetornarNoContent() {

        Long id = 1L;
        Producto productoSimulado = new Producto();
        productoSimulado.setId(id);

        when(productoRepository.findById(id)).thenReturn(Optional.of(productoSimulado));

        ResponseEntity<?> respuesta = productoController.eliminarProducto(id);

        assertEquals(HttpStatus.NO_CONTENT, respuesta.getStatusCode());

        verify(productoRepository).delete(productoSimulado);
    }
}
