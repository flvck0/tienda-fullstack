package botilleriaBackend.demo.config;

import botilleriaBackend.demo.Productos.model.Producto;
import botilleriaBackend.demo.Productos.repository.ProductoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(ProductoRepository repository) {
        return args -> {
            // Solo insertamos si la tabla está vacía
            if (repository.count() == 0) {
                System.out.println("🌱 Base de datos vacía. Iniciando poblado de productos...");

                List<Producto> productos = Arrays.asList(
                        new Producto(null, "Whisky Fireball", "Whisky con sabor a canela, famoso por su “aliento de dragón”.", 15990, 50, new Date(), "imgs/fireball-750-600x600.jpg", "whisky"),
                        new Producto(null, "Jack Daniels Apple", "Jack con un toque de manzana verde para refrescar la noche.", 18990, 50, new Date(), "imgs/1332232.png", "whisky"),
                        new Producto(null, "Cerveza Corona 6 pack", "Refrescante cerveza premium, ideal para compartir.", 7990, 100, new Date(), "imgs/corona6pack.png", "cerveza"),
                        new Producto(null, "Cerveza Cristal 6 pack", "Clásica y heladita, para no fallar nunca.", 6490, 100, new Date(), "imgs/Cristal6.jpg", "cerveza"),
                        new Producto(null, "Heineken 6 pack", "Premium europea, suave y equilibrada.", 8490, 100, new Date(), "imgs/Heineken6pack.jpg", "cerveza"),
                        new Producto(null, "Vodka Absolut", "Clásico sueco de sabor puro para cócteles.", 14990, 40, new Date(), "imgs/vodkaabsolut.png", "vodka"),
                        new Producto(null, "Vodka Smirnoff 750ml", "Versátil y rendidor, perfecto para mezclas.", 11990, 40, new Date(), "imgs/smirnof.webp", "vodka"),
                        new Producto(null, "Havana Club 3 años", "El compañero ideal para un buen mojito.", 13990, 35, new Date(), "imgs/havanaron.jpg", "ron"),
                        new Producto(null, "Captain Morgan Spiced", "Ron especiado para darle power a tus mezclas.", 12990, 35, new Date(), "imgs/ron2.jpg", "ron"),
                        new Producto(null, "Jose Cuervo Especial", "Para shots, margaritas y la mejor previa.", 16990, 30, new Date(), "imgs/JoseCuervo.jpeg", "tequila"),
                        new Producto(null, "Cabernet Sauvignon Reserva", "Tinto con cuerpo, ideal para carnes.", 9990, 25, new Date(), "imgs/vino1.png", "vino"),
                        new Producto(null, "Sauvignon Blanc", "Blanco fresco con notas cítricas.", 8490, 25, new Date(), "imgs/vino2.jpg", "vino"),
                        new Producto(null, "Red Bull 250ml", "Energía para seguir la noche.", 1690, 200, new Date(), "imgs/redbull.webp", "energetico"),
                        new Producto(null, "Monster 473ml", "Intenso y rendidor para mezclar.", 1990, 200, new Date(), "imgs/monster.webp", "energetico")
                );

                repository.saveAll(productos);
                System.out.println("✅ Productos insertados correctamente en la Base de Datos.");
            } else {
                System.out.println("⚡️ La base de datos ya tiene productos. No se requiere inicialización.");
            }
        };
    }
}