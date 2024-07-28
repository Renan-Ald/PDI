import React from 'react';

const Checkout = () => {
  const confirmarCompra = async () => {
    const response = await fetch('/carrinho/confirmar/', {
      method: 'POST',
      credentials: 'include',
    });

    const data = await response.json();
    if (data.status === 'success') {
      alert('Compra realizada com sucesso!');
      // Redirecionar ou atualizar o estado conforme necessário
    } else {
      alert('Falha na compra');
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      <button onClick={() => confirmarCompra()}>Confirmar Compra</button>
    </div>
  );
};

export default Checkout;
