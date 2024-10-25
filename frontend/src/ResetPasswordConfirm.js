import { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ResetPasswordConfirm() {
    const { uidb64, token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/reset-password-confirm/', {
                uidb64,
                token,
                new_password: newPassword,
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error resetting password. Please try again.');
        }
    };

    return (
        <div>
            <h2>Set New Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                />
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default ResetPasswordConfirm;
