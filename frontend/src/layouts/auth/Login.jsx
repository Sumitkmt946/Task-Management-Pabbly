import React, { useState } from 'react'
import "./login.css"
import login from "../../assets/register/login.png"
import email from "../../assets/register/email.png"
import password from "../../assets/register/password.png"
import { Link } from 'react-router-dom';
import axios from 'axios';
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
        try {
            const response = await axios.post('/api/login', formData);
            const token = response?.data?.token;
            localStorage.setItem('tm_token', token);
            // fetch profile and store for immediate sidebar display
            try {
                const axiosInstance = axios.create({ headers: { Authorization: `Bearer ${token}` } });
                const profileRes = await axiosInstance.get('/api/me');
                localStorage.setItem('tm_user', JSON.stringify(profileRes.data));
            } catch (err) {
                console.error('Failed to fetch profile after login', err);
            }
            navigate('/admin/tasks')
        } catch (error) {
            const Error = error?.response?.data?.message || error.message || 'Login failed';
            setFormData({
                email: '',
                password: ''
            });
            toast({
                title: Error,
                status: 'error',
                position: 'top',
                duration: 5000,
                isClosable: true,
            });
            setLoading(false);
        }
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