import React, { useEffect, useState } from 'react';
import { getCartItems, updateCartItem, deleteCartItem, checkout } from './api';
import './Cart.css'
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const data = await getCartItems();
        setCartItems(data);
      } catch (error) {
        console.error('Erro ao buscar itens do carrinho:', error);
      }
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    const calculateTotal = () => {
      const totalValue = cartItems.reduce((sum, item) => sum + item.servico.valor * item.quantidade, 0);
      setTotal(totalValue);
    };

    calculateTotal();
  }, [cartItems]);

  const handleUpdateQuantity = async (id, quantidade, servico_id) => {
    if (quantidade <= 0) {
      handleRemoveItem(id, servico_id);
      return;
    }

    try {
      await updateCartItem(id, { quantidade, servico_id });
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantidade } : item
      ));
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
    }
  };

  const handleCheckout = async () => {
    try {
      await checkout(cartItems);
      alert('Compra finalizada com sucesso!');
    } catch (error) {
      console.error('Erro ao finalizar a compra:', error);
    }
  };

  const handleRemoveItem = async (id, servico_id) => {
    try {
      await deleteCartItem(id, servico_id);
      setCartItems(cartItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error);
    }
  };

  return (
    <section className='vh-100'>
    <div id='cart' className="container mt-5 cart-background">
      <h1 className="mb-4 text-cart">Meu Carrinho</h1>
      <h3 className="mb-4 text-cart">Total: R${total.toFixed(2)}</h3>
      <ul className="list-group mb-3 cart-background">
        {cartItems.map(item => (
          <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center cart-background">
            <div>
              <h5 className="text-cart">{item.servico.nome}</h5>
              <p className="text-cart">{item.servico.descricao}</p>
              <p className="text-cart">Preço: R${item.servico.valor}</p>
            </div>
            <div className="d-flex align-items-center">
              <button
                className="btn btn-light plus "
                onClick={() => handleUpdateQuantity(item.id, item.quantidade + 1, item.servico.id)}
              >
                <i className="bi bi-plus-circle"></i>
              </button>
              <span className="mx-3">{item.quantidade}</span>
              <button
                className="btn btn-light plus"
                onClick={() => handleUpdateQuantity(item.id, item.quantidade - 1, item.servico.id)}
              >
                <i className="bi bi-dash-circle"></i>
              </button>
              <button
                className="btn btn-danger ml-3"
                onClick={() => handleRemoveItem(item.id, item.servico.id)}
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button className="btn btn-primary" onClick={handleCheckout}>Finalizar Compra</button>
      <br></br>
    </div>
    </section>
  );  
};

export default Cart;
