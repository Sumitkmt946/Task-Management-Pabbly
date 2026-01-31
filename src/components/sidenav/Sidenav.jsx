import React, { useEffect, useState } from 'react'
import "./sidenav.css"

import { FaTasks, FaUsers, FaFolderOpen, FaUserCog } from "react-icons/fa";

import { LuLogOut } from "react-icons/lu";
import profile from '../../assets/sidenav/profile.png';
import axios from 'axios';
import { Link, useLocation } from "react-router-dom";

function Sidenav() {
  const location = useLocation();
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('tm_user');
      if (raw) return JSON.parse(raw);
      const token = localStorage.getItem('tm_token');
      if (token) {
        // try to decode token payload for immediate display (no verification)
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const payload = JSON.parse(jsonPayload);
          return { firstName: payload.firstName, lastName: payload.lastName, email: payload.email };
        } catch (e) {
          return null;
        }
      }
      return null;
    } catch (e) { return null; }
  });

  useEffect(() => {
    const token = localStorage.getItem('tm_token');
    if (!token) return;
    const axiosInstance = axios.create({ headers: { Authorization: `Bearer ${token}` } });
    axiosInstance.get('/api/me')
      .then(res => {
        setUser(res.data);
        localStorage.setItem('tm_user', JSON.stringify(res.data));
      })
      .catch(err => console.error('Failed to load profile', err));
  }, []);

  // Listen for other parts of the app updating the profile and refresh local state
  useEffect(() => {
    const onUserUpdated = () => {
      try {
        const raw = localStorage.getItem('tm_user');
        setUser(raw ? JSON.parse(raw) : null);
      } catch (e) {
        setUser(null);
      }
    };
    window.addEventListener('tm_user_updated', onUserUpdated);
    return () => window.removeEventListener('tm_user_updated', onUserUpdated);
  }, []);

  const displayEmail = user ? user.email : '';
  const getNameFromEmail = (email) => {
    if (!email) return 'User Name';
    const local = email.split('@')[0];
    // replace dots/underscores with space and capitalize words
    return local.split(/[._-]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  };
  const displayName = user ? ((user.firstName || user.lastName) ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : getNameFromEmail(user.email)) : 'User Name';
  const avatarUrl = (user && (user.firstName || user.lastName || user.email)) ? `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0D9488&color=ffffff&rounded=true&size=128` : profile;

  return (
    <div className='sidenav-main-container'>
      <div className='sidenav-profile-container'>
        <img className='sidenav-profile-img' src={avatarUrl} alt="Profile" />
        <p className='sidenav-profile-name'>{displayName}</p>
        <p className='sidenav-profile-email'>{displayEmail}</p>
      </div>
      <div className='sidenav-list-main-container'>
        <Link to="/admin/tasks"><div className={`sidenav-list ${location.pathname === "/admin/tasks" ? "default-hover" : ""}`}><span><FaTasks className='sidenav-icon' /></span><p className='sidenav-list-text'>Tasks</p></div></Link>
        <Link to="/admin/team"><div className={`sidenav-list ${location.pathname === "/admin/team" ? "default-hover" : ""}`}><span><FaUsers className='sidenav-icon' /></span><p className='sidenav-list-text'>Team</p></div></Link>
        <Link to="/admin/projects"><div className={`sidenav-list ${location.pathname === "/admin/projects" ? "default-hover" : ""}`}><span><FaFolderOpen className='sidenav-icon' /></span><p className='sidenav-list-text'>Projects</p></div></Link>
        <Link to="/admin/profile"><div className={`sidenav-list ${location.pathname === "/admin/profile" ? "default-hover" : ""}`}><span><FaUserCog className='sidenav-icon' /></span><p className='sidenav-list-text'>Profile</p></div></Link>
        <Link to="/logout"><div className={`sidenav-list ${location.pathname === "/logout" ? "default-hover" : ""}`}><span><LuLogOut className='sidenav-icon' /></span><p className='sidenav-list-text'>Logout</p></div></Link>
      </div>
    </div>
  )
}

export default Sidenav