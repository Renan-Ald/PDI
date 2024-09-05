// src/ResetPassword.js

import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const { uid, token } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('As senhas não coincidem.');
            return;
        }
        try {
            const response = await axios.post(`/reset/${uid}/${token}/`, { password: newPassword });
            setMessage('Sua senha foi redefinida com sucesso.');
        } catch (error) {
            setMessage('Erro ao redefinir a senha. Por favor, tente novamente.');
        }
    };

    return (
        <div>
            <h2>Redefinir sua senha</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Nova senha:
                    <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)} 
                        required
                    />
                </label>
                <label>
                    Confirmar nova senha:
                    <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required
                    />
                </label>
                <button type="submit">Redefinir senha</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default ResetPassword;
