import React, { useEffect, useState } from 'react'
import Sidenav from '../../components/sidenav/Sidenav'
import Navbar from '../../components/navbar/Navbar'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'

function Settings() {
  const toast = useToast();
  const [user, setUser] = useState(() => {
    try { const raw = localStorage.getItem('tm_user'); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  });
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('tm_token');
    if (!token) return;
    const axiosInstance = axios.create({ headers: { Authorization: `Bearer ${token}` } });
    axiosInstance.get('/api/me')
      .then(res => {
        setUser(res.data);
        setForm({ firstName: res.data.firstName || '', lastName: res.data.lastName || '', email: res.data.email || '' });
        localStorage.setItem('tm_user', JSON.stringify(res.data));
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const saveProfile = async () => {
    const token = localStorage.getItem('tm_token');
    if (!token) return toast({ title: 'Not authenticated', status: 'error' });
    setLoading(true);
    try {
      const axiosInstance = axios.create({ headers: { Authorization: `Bearer ${token}` } });
      const res = await axiosInstance.patch('/api/auth/me', form);
      setUser(res.data);
      localStorage.setItem('tm_user', JSON.stringify(res.data));
      window.dispatchEvent(new Event('tm_user_updated'));
      toast({ title: 'Profile updated', status: 'success' });
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err.message || 'Update failed';
      toast({ title: msg, status: 'error' });
    }
    setLoading(false);
  };

  const fillSample = () => {
    const sample = { firstName: 'Sundar', lastName: 'Gurung', email: 'sundargurung360@gmail.com' };
    setForm(sample);
  };

  const handleFile = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const token = localStorage.getItem('tm_token');
    if (!token) return toast({ title: 'Not authenticated', status: 'error' });
    const fd = new FormData();
    fd.append('avatar', f);
    try {
      const axiosInstance = axios.create({ headers: { Authorization: `Bearer ${token}` } });
      const res = await axiosInstance.post('/api/me/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUser(res.data);
      localStorage.setItem('tm_user', JSON.stringify(res.data));
      window.dispatchEvent(new Event('tm_user_updated'));
      toast({ title: 'Avatar uploaded', status: 'success' });
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Upload failed';
      toast({ title: msg, status: 'error' });
    }
  };

  return (
    <div className='app-main-container'>
      <div className='app-main-left-container'><Sidenav /></div>
      <div className='app-main-right-container'>
        <Navbar />
        <div style={{ padding: 24 }}>
          <h2>Account Settings</h2>
          <div style={{ marginTop: 12, maxWidth: 480 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>First Name</label>
            <input name='firstName' value={form.firstName} onChange={handleChange} style={{ width: '100%', padding: 8, marginBottom: 12 }} />
            <label style={{ display: 'block', marginBottom: 8 }}>Last Name</label>
            <input name='lastName' value={form.lastName} onChange={handleChange} style={{ width: '100%', padding: 8, marginBottom: 12 }} />
            <label style={{ display: 'block', marginBottom: 8 }}>Email</label>
            <input name='email' value={form.email} onChange={handleChange} style={{ width: '100%', padding: 8, marginBottom: 12 }} />
            <label style={{ display: 'block', marginBottom: 8 }}>Profile Photo</label>
            <input type='file' accept='image/*' onChange={handleFile} style={{ display: 'block', marginBottom: 12 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className='table-btn-task' onClick={saveProfile} disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
              <button className='table-btn-task' onClick={fillSample} type='button'>Fill Sample</button>
            </div>
            {!user && <p style={{ marginTop: 12, color: '#666' }}>No saved user on server yet — you can fill sample data and press Save.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
