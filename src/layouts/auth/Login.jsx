import React, { useState } from 'react'
import "./login.css"
import login from "../../assets/register/login.png"
import email from "../../assets/register/email.png"
import password from "../../assets/register/password.png"
import { Link } from 'react-router-dom';
import { useToast, Spinner } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Mock authentication - bypass backend
        const mockToken = 'mock_token_' + Date.now();
        const mockUser = {
            id: 1,
            name: formData.email.split('@')[0],
            email: formData.email,
            role: 'admin'
        };

        localStorage.setItem('tm_token', mockToken);
        localStorage.setItem('tm_user', JSON.stringify(mockUser));

        toast({
            title: 'Login successful!',
            status: 'success',
            position: 'top',
            duration: 3000,
            isClosable: true,
        });

        navigate('/admin/tasks');
    };
    return (
        <div className='login-main-container'>
            <div className='login-container'>
                <div className='login-left-container'>
                    <p className='signup-text'>Sign In</p>
                    <form onSubmit={handleSubmit}>
                        <div className='input-main-container'>
                            <img className='input-icon' src={email} alt="input" />
                            <input
                                placeholder='Email *'
                                type='email'
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='input-main-container'>
                            <img className='input-icon' src={password} alt="input" />
                            <input
                                placeholder='Password *'
                                type='password'
                                name='password'
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button className='login-btn' type='submit'><p>{loading ? <Spinner color='white' /> : 'Login'}</p></button>
                    </form>
                    <p className='account-text'>Don’t have an account? <Link to='/register'><span>Sign Up</span></Link></p>
                </div>
                <div className='login-right-container'>
                    <img className='login-img' src={login} alt="login" />
                </div>
            </div>
        </div>
    )
}

export default Login