import { useState } from 'react';
import axios from 'axios';
import './resetPasswordConfirm.css';

function RequestResetPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/request-reset-password/', { email });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Erro ao enviar o link de redefinição. Tente novamente.');
        }
    };

    return (
        <section className="vh-100">
        <div className="reset-password-container">
            <h2 className="reset-password-title">Esqueceu a Senha?</h2>
            <p className="reset-password-instruction">Informe seu e-mail para receber um link de redefinição de senha.</p>
            <form onSubmit={handleSubmit} className="reset-password-form">
                <div className="reset-password-form-group">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Digite seu e-mail"
                        className="reset-password-input"
                    />
                </div>
                <button type="submit" className="reset-password-button">Enviar Link de Redefinição</button>
            </form>
            {message && <p className="reset-password-message">{message}</p>}
        </div>
        </section>
    );
}

export default RequestResetPassword;
