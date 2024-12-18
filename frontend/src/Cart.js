import React, { useEffect, useState } from 'react';
import { getCartItems, updateCartItem, deleteCartItem, checkout } from './api';
import './Cart.css';

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
      const totalValue = cartItems.reduce(
        (sum, item) => sum + item.servico.valor * item.quantidade,
        0
      );
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
      setCartItems(
        cartItems.map((item) =>
          item.id === id ? { ...item, quantidade } : item
        )
      );
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
      setCartItems(cartItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error);
    }
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <section className="h-100 h-custom cart ">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12">
            <div
              className="card card-registration card-registration-2"
              style={{ borderRadius: '1px' }}
            >
              <div className="card-body p-0">
                <div className="row g-0">
                  <div className="col-lg-8">
                    <div className="p-5">
                      <div className="d-flex justify-content-between align-items-center mb-5">
                        <h1 className="fw-bold mb-0">Meu Carrinho</h1>
                        <h6 className="mb-0 text-muted">
                          {cartItems.length} itens
                        </h6>
                      </div>
                      <hr className="my-4" />

                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="row mb-4 d-flex justify-content-between align-items-center"
                        >
                          {/* <div className="col-md-2 col-lg-2 col-xl-2">
                            <img
                              src="https://via.placeholder.com/150"
                              className="img-fluid rounded-3"
                              alt={item.servico.nome}
                            />
                          </div> */}
                          <div className="col-md-3 col-lg-3 col-xl-3">
                            <h6 className="text-muted">
                              {item.servico.descricao}
                            </h6>
                            <h6 className="mb-0">{item.servico.nome}</h6>
                          </div>
                          <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
                            <button
                              className="btn btn-link px-2"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.id,
                                  item.quantidade - 1,
                                  item.servico.id
                                )
                              }
                            >
                              <i className="fas fa-minus"></i>
                            </button>

                            <input
                              min="1"
                              value={item.quantidade}
                              type="number"
                              readOnly
                              className="form-control form-control-sm"
                            />

                            <button
                              className="btn btn-link px-2"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.id,
                                  item.quantidade + 1,
                                  item.servico.id
                                )
                              }
                            >
                              <i className="fas fa-plus "></i>
                            </button>
                          </div>
                          <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                            <h6 className="mb-0">
                              {formatCurrency(item.servico.valor)}
                            </h6>
                          </div>
                          <div className="col-md-1 col-lg-1 col-xl-1 text-end">
                            <button
                              className="btn btn-link text-muted"
                              onClick={() =>
                                handleRemoveItem(item.id, item.servico.id)
                              }
                            >
                              <i className="fas fa-times "></i>
                            </button>
                          </div>
                        </div>
                      ))}

                      <hr className="my-4" />

                      <div className="pt-5">
                        <h6 className="mb-0">
                          Total: <strong>{formatCurrency(total)}</strong>
                        </h6>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 bg-grey">
                    <div className="p-5">
                      <h3 className="fw-bold mb-5">Resumo</h3>
                      <h6 className="text-muted">
                        Total: <strong>{formatCurrency(total)}</strong>
                      </h6>
                      <button
                        className=" btn-finalizar-compra btn btn-primary btn-lg mt-4 "
                        onClick={handleCheckout}
                      >
                        Finalizar Compra
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
