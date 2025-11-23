package botilleriaBackend.demo.Productos.controller;

import botilleriaBackend.demo.Productos.model.Producto;
import botilleriaBackend.demo.Productos.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.hateoas.Link;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<Producto>> obtenerProductoPorId(@PathVariable Long id) {

        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id)); // Usar una excepción adecuada

        EntityModel<Producto> productoModel = EntityModel.of(producto,
                linkTo(methodOn(ProductoController.class).obtenerProductoPorId(id)).withSelfRel(), // Enlace a sí mismo
                linkTo(methodOn(ProductoController.class).obtenerTodosLosProductos()).withRel("todos")); // Enlace a la colección

        return new ResponseEntity<>(productoModel, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<CollectionModel<EntityModel<Producto>>> obtenerTodosLosProductos() {
        List<EntityModel<Producto>> productos = productoRepository.findAll().stream()
                .map(producto -> EntityModel.of(producto,
                        linkTo(methodOn(ProductoController.class).obtenerProductoPorId(producto.getId())).withSelfRel(), // Enlace a cada recurso individual
                        linkTo(methodOn(ProductoController.class).obtenerTodosLosProductos()).withRel("todos"))) // Enlace a la colección
                .collect(Collectors.toList());

        CollectionModel<EntityModel<Producto>> collectionModel = CollectionModel.of(productos,
                linkTo(methodOn(ProductoController.class).obtenerTodosLosProductos()).withSelfRel(),
                linkTo(methodOn(ProductoController.class).crearProducto(new Producto())).withRel("crear-producto")); // Enlace a POST

        return new ResponseEntity<>(collectionModel, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<EntityModel<Producto>> crearProducto(@RequestBody Producto producto) {
        Producto nuevoProducto = productoRepository.save(producto);

        EntityModel<Producto> productoModel = EntityModel.of(nuevoProducto,
                linkTo(methodOn(ProductoController.class).obtenerProductoPorId(nuevoProducto.getId())).withSelfRel(),
                linkTo(methodOn(ProductoController.class).obtenerTodosLosProductos()).withRel("todos"));

        Link selfLink = productoModel.getLink(IanaLinkRelations.SELF).get();
        return ResponseEntity
                .created(selfLink.toUri())
                .body(productoModel);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntityModel<Producto>> actualizarProducto(@PathVariable Long id, @RequestBody Producto productoDetalles) {

        Producto productoActualizado = productoRepository.findById(id)
                .map(productoExistente -> {
                    productoExistente.setNombre(productoDetalles.getNombre());
                    productoExistente.setDescripcion(productoDetalles.getDescripcion());
                    productoExistente.setPrecio(productoDetalles.getPrecio());
                    productoExistente.setStock(productoDetalles.getStock());
                    return productoRepository.save(productoExistente);
                })
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));

        EntityModel<Producto> productoModel = EntityModel.of(productoActualizado,
                linkTo(methodOn(ProductoController.class).obtenerProductoPorId(productoActualizado.getId())).withSelfRel(),
                linkTo(methodOn(ProductoController.class).obtenerTodosLosProductos()).withRel("todos"));

        return new ResponseEntity<>(productoModel, HttpStatus.OK);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarProducto(@PathVariable Long id) {
        // 1. Buscamos el producto primero
        java.util.Optional<Producto> productoOpt = productoRepository.findById(id);

        // 2. Si existe, lo borramos
        if (productoOpt.isPresent()) {
            productoRepository.delete(productoOpt.get());
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 Exitoso
        }

        // 3. Si no existe, devolvemos 404
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
