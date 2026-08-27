import { useState, useEffect } from 'react';

export const useCart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const loadCart = () => {
      try {
        const saved = JSON.parse(localStorage.getItem('cart')) || [];

        setCart(saved);
      } catch { setCart([]); }
    };

    loadCart();

    window.addEventListener('storage', loadCart);
    window.addEventListener('local-storage-update', loadCart);

    return () => {
      window.removeEventListener('storage', loadCart);
      window.removeEventListener('local-storage-update', loadCart);
    };
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('local-storage-update'));
  };

  const addToCart = (product, quantity = 1) => {
    const updatedCart = [...cart];
    const index = updatedCart.findIndex(item => item.id === product.id);

    const stockAvailable = product.stockQuantity || 0;

    if (index >= 0) {
      const newQuantity = updatedCart[index].quantity + quantity;

      if (newQuantity > stockAvailable) {
        alert(`No puedes agregar más. El stock máximo es ${stockAvailable}.`);

        return;
      }

      updatedCart[index].quantity = newQuantity;
      updatedCart[index].stockQuantity = stockAvailable;
    } else {

      updatedCart.push({
        id: product.id,
        name: product.name,
        price: product.currentUnitPrice,
        sku: product.sku,
        stockQuantity: stockAvailable,
        quantity,
      });
    }

    saveCart(updatedCart);
    alert('Producto agregado al carrito');
  };

  const updateQuantity = (id, delta) => {
    const updatedCart = cart.map(item => {
      if (item.id === id) {

        const newQty = item.quantity + delta;

        if (delta > 0 && newQty > item.stockQuantity) {
          return item;
        }

        return { ...item, quantity: Math.max(1, newQty) };
      }

      return item;
    });

    saveCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);

    saveCart(updatedCart);
  };

  const clearCart = () => saveCart([]);

  return { cart, addToCart, updateQuantity, removeItem, clearCart };
};