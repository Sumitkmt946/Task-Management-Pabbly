import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear the token from localStorage
        localStorage.removeItem('tm_token');
        // Redirect to login page
        navigate('/');
    }, [navigate]);

    return (
        <div>
            Logging out...
        </div>
    )
}

export default Logout
