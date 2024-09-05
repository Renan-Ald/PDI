// src/ForgotPassword.js

import React, { useState } from 'react';
import axios from 'axios';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/password_reset/', { email });
            setMessage('Um e-mail de recuperação foi enviado.');
        } catch (error) {
            setMessage('Erro ao enviar o e-mail. Verifique o endereço e tente novamente.');
        }
    };

    return (
        <div>
            <h2>Esqueceu sua senha?</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                </label>
                <button type="submit">Enviar</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default ForgotPassword;
