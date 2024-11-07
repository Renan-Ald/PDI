import { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './resetPasswordConfirm.css';

function ResetPasswordConfirm() {
    const { uidb64, token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('As senhas não correspondem.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/reset-password-confirm/', {
                uidb64,
                token,
                new_password: newPassword,
            });
            setMessage(response.data.message);
            setError('');
        } catch (error) {
            setMessage('Erro ao redefinir a senha. Tente novamente.');
            setError('');
        }
    };

    return (
        <section className="vh-100">
        <div className="container">
            <h2>Redefinir Senha</h2>
            <p>Digite uma nova senha para a sua conta e confirme-a abaixo.</p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Digite a nova senha"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirme a nova senha"
                    />
                </div>
                <button type="submit">Redefinir Senha</button>
            </form>
            {error && <p className="message">{error}</p>}
            {message && <p className="message">{message}</p>}
        </div>
        </section>
    );
}

export default ResetPasswordConfirm;
