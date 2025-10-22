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
      setCarrito(carritoActual => 
        carritoActual.map(item =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      );
    } else {
      setCarrito(carritoActual => 
        [...carritoActual, { ...producto, cantidad: 1 }]
      );
    }
    
    alert(`${producto.nombre} agregado al carrito 🛒`);
  };
  
  const eliminarDelCarrito = (idProducto) => {
    setCarrito(carritoActual => 
      carritoActual.filter(item => item.id !== idProducto)
    );
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    alert("¡Gracias por tu compra! 🎉");
  };

  return (
    <CartContext.Provider value={{ 
      carrito, 
      agregarAlCarrito, 
      eliminarDelCarrito, 
      vaciarCarrito
    }}>
      {children}
    </CartContext.Provider>
  );
};