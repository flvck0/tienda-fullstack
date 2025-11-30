import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem("carrito");
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    const existente = carrito.find((it) => it.id === producto.id);
    if (existente) {
      setCarrito(prev => prev.map(item =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setCarrito(prev => [...prev, { ...producto, cantidad: 1 }]);
    }
  };
  
  const eliminarDelCarrito = (idProducto) => {
    setCarrito(prev => prev.filter(item => item.id !== idProducto));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // 🔥 FUNCIÓN COMPRAR REFORZADA (Versión Final) 🔥
  const comprar = async (token, usuarioId) => {
    console.log("--- INICIO PROCESO DE COMPRA ---");
    
    // 1. Validaciones Previas
    if (!token || !usuarioId) {
      alert("⚠️ Error: Sesión inválida. Por favor, inicia sesión nuevamente.");
      return false;
    }

    if (carrito.length === 0) {
      alert("🛒 El carrito está vacío.");
      return false;
    }

    // 2. Preparar Datos para el Backend
    const pedidoPayload = {
      usuario: { id: usuarioId },
      detalles: carrito.map(item => ({
        producto: { id: item.id },
        cantidad: item.cantidad
      }))
    };

    const url = 'http://localhost:8080/api/pedidos'; // URL Fija para evitar errores relativos
    console.log("Enviando a:", url);
    console.log("Datos:", JSON.stringify(pedidoPayload));

    try {
      // 3. Intentar Conexión
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pedidoPayload)
      });

      console.log("Status respuesta:", response.status);

      // 4. Manejo de Errores del Servidor (400, 500, etc.)
      if (!response.ok) {
        const textoError = await response.text();
        console.error("Error del servidor:", textoError);
        // Lanzamos un error con el mensaje que vino de Java (ej: "Sin stock")
        throw new Error(textoError || `Error ${response.status} del servidor`);
      }

      // 5. Éxito
      const data = await response.json();
      console.log("Respuesta exitosa:", data);

      vaciarCarrito();
      alert(`✅ ¡Compra Exitosa! \nPedido #${data.id} registrado correctamente.`);
      return true;

    } catch (error) {
      console.error("EXCEPCIÓN FETCH:", error);
      
      let mensajeUsuario = "Hubo un error al procesar la compra.";
      
      // 6. Detección específica de "Failed to fetch" (Error de Red)
      if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
        mensajeUsuario = "❌ Error de Conexión (Failed to fetch).\n\n" +
                         "El navegador no puede conectar con 'http://localhost:8080'.\n" +
                         "Posibles causas:\n" +
                         "1. El Backend NO está corriendo (Dale Play en IntelliJ).\n" +
                         "2. El Backend está en otro puerto (Revisa la consola de IntelliJ).\n" +
                         "3. Bloqueo de CORS (Si reiniciaste el backend, esto no debería pasar).";
      } else {
        // Si el error vino del servidor (ej: Sin Stock), mostramos ese mensaje
        mensajeUsuario = "❌ Error: " + error.message;
      }

      alert(mensajeUsuario);
      return false;
    }
  };

  return (
    <CartContext.Provider value={{ 
      carrito, 
      agregarAlCarrito, 
      eliminarDelCarrito, 
      vaciarCarrito,
      comprar
    }}>
      {children}
    </CartContext.Provider>
  );
};