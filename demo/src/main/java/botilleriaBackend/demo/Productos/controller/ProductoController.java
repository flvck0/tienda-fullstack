package botilleriaBackend.demo.Productos.controller;

import botilleriaBackend.demo.Productos.model.Producto;
import botilleriaBackend.demo.Productos.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // 💥 React (Vite) puede llamar sin problema
public class ProductoController {

    private final ProductoRepository productoRepository;

    // =========================
    //  GET TODOS LOS PRODUCTOS
    //  /api/productos
    // =========================
    @GetMapping
    public List<Producto> obtenerTodosLosProductos() {
        // 👈 Devolvemos directamente la lista, SIN HATEOAS
        return productoRepository.findAll();
    }

    // =========================
    //  GET POR ID
    //  /api/productos/{id}
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProductoPorId(@PathVariable Long id) {
        Optional<Producto> productoOpt = productoRepository.findById(id);

        if (productoOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(productoOpt.get(), HttpStatus.OK);
    }

    // =========================
    //  CREAR PRODUCTO
    //  POST /api/productos
    // =========================
    @PostMapping
    public ResponseEntity<Producto> crearProducto(@RequestBody Producto producto) {
        Producto nuevo = productoRepository.save(producto);
        return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
    }

    // =========================
    //  ACTUALIZAR PRODUCTO
    //  PUT /api/productos/{id}
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(
            @PathVariable Long id,
            @RequestBody Producto productoDetalles
    ) {
        Optional<Producto> productoOpt = productoRepository.findById(id);

        if (productoOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Producto productoExistente = productoOpt.get();
        productoExistente.setNombre(productoDetalles.getNombre());
        productoExistente.setDescripcion(productoDetalles.getDescripcion());
        productoExistente.setPrecio(productoDetalles.getPrecio());
        productoExistente.setStock(productoDetalles.getStock());
        productoExistente.setImagenUrl(productoDetalles.getImagenUrl());
        productoExistente.setCategoria(productoDetalles.getCategoria());
        // si usas fecha, puedes decidir si actualizarla o no:
        // productoExistente.setFecha(productoDetalles.getFecha());

        Producto actualizado = productoRepository.save(productoExistente);
        return new ResponseEntity<>(actualizado, HttpStatus.OK);
    }

    // =========================
    //  ELIMINAR PRODUCTO
    //  DELETE /api/productos/{id}
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        Optional<Producto> productoOpt = productoRepository.findById(id);

        if (productoOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        productoRepository.delete(productoOpt.get());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
