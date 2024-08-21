import React, { useState, useEffect } from 'react';
import { getCartItems, updateCartItem, checkout } from './api'; // Supondo que essas funções estejam definidas

const Cart = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await getCartItems();
        setItems(response);
      } catch (error) {
        setError('Erro ao buscar itens do carrinho.');
        console.error('Erro ao buscar itens do carrinho:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleQuantityChange = async (id, quantity) => {
    if (quantity < 1) {
      return; // Evita quantidades negativas ou zero
    }
    
    try {
      await updateCartItem(id, quantity);
      const updatedItems = items.map(item => item.id === id ? { ...item, quantity } : item);
      setItems(updatedItems);
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
    }
  };

  const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    try {
      await checkout();
      alert('Compra finalizada com sucesso!');
      // Opcionalmente, redirecione para uma página de confirmação ou esvazie o carrinho
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Carrinho</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} - {item.price} x 
            <input
              type="number"
              value={item.quantity}
              min="1"
              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
            />
          </li>
        ))}
      </ul>
      <h2>Total: {totalAmount.toFixed(2)}</h2>
      <button onClick={handleCheckout}>Finalizar Compra1</button>
    </div>
  );
};

export default Cart;
