import React, { useState, useEffect } from 'react'
import Sidenav from '../../components/sidenav/Sidenav'
import Navbar from '../../components/navbar/Navbar'
import { useToast, Switch, Avatar } from '@chakra-ui/react'
import { FaUser, FaEnvelope, FaPhone, FaMoon, FaSun, FaBell, FaLock, FaSave } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import "./profile.css"

function Profile() {
    const toast = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('tm_darkMode') === 'true';
    });
    const [notifications, setNotifications] = useState(() => {
        return localStorage.getItem('tm_notifications') !== 'false';
    });

    const [profile, setProfile] = useState(() => {
        const stored = localStorage.getItem('tm_user');
        if (stored) {
            const user = JSON.parse(stored);
            return {
                name: user.name || 'Demo User',
                email: user.email || 'demo@example.com',
                phone: user.phone || '+91 98765 43210',
                role: user.role || 'Admin',
                department: user.department || 'Management',
                bio: user.bio || 'Task Management System Administrator'
            };
        }
        return {
            name: 'Demo User',
            email: 'demo@example.com',
            phone: '+91 98765 43210',
            role: 'Admin',
            department: 'Management',
            bio: 'Task Management System Administrator'
        };
    });

    const [formData, setFormData] = useState(profile);

    useEffect(() => {
        // Apply dark mode
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('tm_darkMode', darkMode);
    }, [darkMode]);

    useEffect(() => {
        localStorage.setItem('tm_notifications', notifications);
    }, [notifications]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        setProfile(formData);
        // Update localStorage
        const currentUser = JSON.parse(localStorage.getItem('tm_user') || '{}');
        const updatedUser = { ...currentUser, ...formData };
        localStorage.setItem('tm_user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('tm_user_updated'));

        setIsEditing(false);
        toast({
            title: 'Profile updated successfully!',
            status: 'success',
            position: 'top',
            duration: 3000,
            isClosable: true,
        });
    };

    const handleCancel = () => {
        setFormData(profile);
        setIsEditing(false);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        toast({
            title: `${!darkMode ? 'Dark' : 'Light'} mode enabled`,
            status: 'info',
            position: 'top',
            duration: 2000,
            isClosable: true,
        });
    };

    return (
        <>
            <div className={`app-main-container ${darkMode ? 'dark-mode' : ''}`}>
                <div className='app-main-left-container'><Sidenav /></div>
                <div className='app-main-right-container'>
                    <Navbar />
                    <div className='dashboard-main-container'>
                        <div className='profile-content-container'>
                            {/* Profile Header */}
                            <div className='profile-header-section'>
                                <div className='profile-avatar-container'>
                                    <Avatar
                                        size='2xl'
                                        name={profile.name}
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=0D9488&color=ffffff&size=200`}
                                    />
                                    <div className='profile-header-info'>
                                        <h1 className='profile-name'>{profile.name}</h1>
                                        <p className='profile-role'>{profile.role} • {profile.department}</p>
                                        <p className='profile-email'>{profile.email}</p>
                                    </div>
                                </div>
                                {!isEditing && (
                                    <button className='edit-profile-btn' onClick={() => setIsEditing(true)}>
                                        <MdEdit /> Edit Profile
                                    </button>
                                )}
                            </div>

                            <div className='profile-grid'>
                                {/* Profile Details */}
                                <div className='profile-card'>
                                    <h3 className='card-title'>
                                        <FaUser className='card-icon' /> Profile Information
                                    </h3>

                                    <div className='profile-form'>
                                        <div className='form-group'>
                                            <label>Full Name</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                />
                                            ) : (
                                                <p>{profile.name}</p>
                                            )}
                                        </div>

                                        <div className='form-group'>
                                            <label><FaEnvelope /> Email</label>
                                            {isEditing ? (
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                            ) : (
                                                <p>{profile.email}</p>
                                            )}
                                        </div>

                                        <div className='form-group'>
                                            <label><FaPhone /> Phone</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                />
                                            ) : (
                                                <p>{profile.phone}</p>
                                            )}
                                        </div>

                                        <div className='form-group'>
                                            <label>Department</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="department"
                                                    value={formData.department}
                                                    onChange={handleChange}
                                                />
                                            ) : (
                                                <p>{profile.department}</p>
                                            )}
                                        </div>

                                        <div className='form-group'>
                                            <label>Bio</label>
                                            {isEditing ? (
                                                <textarea
                                                    name="bio"
                                                    value={formData.bio}
                                                    onChange={handleChange}
                                                    rows={3}
                                                />
                                            ) : (
                                                <p>{profile.bio}</p>
                                            )}
                                        </div>

                                        {isEditing && (
                                            <div className='form-actions'>
                                                <button className='save-btn' onClick={handleSave}>
                                                    <FaSave /> Save Changes
                                                </button>
                                                <button className='cancel-btn' onClick={handleCancel}>
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Settings */}
                                <div className='settings-section'>
                                    <div className='profile-card'>
                                        <h3 className='card-title'>⚙️ App Settings</h3>

                                        <div className='settings-list'>
                                            <div className='setting-item'>
                                                <div className='setting-info'>
                                                    {darkMode ? <FaMoon className='setting-icon moon' /> : <FaSun className='setting-icon sun' />}
                                                    <div>
                                                        <p className='setting-name'>Dark Mode</p>
                                                        <p className='setting-desc'>Switch between light and dark theme</p>
                                                    </div>
                                                </div>
                                                <Switch
                                                    colorScheme='teal'
                                                    isChecked={darkMode}
                                                    onChange={toggleDarkMode}
                                                    size='lg'
                                                />
                                            </div>

                                            <div className='setting-item'>
                                                <div className='setting-info'>
                                                    <FaBell className='setting-icon bell' />
                                                    <div>
                                                        <p className='setting-name'>Notifications</p>
                                                        <p className='setting-desc'>Receive task reminders and updates</p>
                                                    </div>
                                                </div>
                                                <Switch
                                                    colorScheme='teal'
                                                    isChecked={notifications}
                                                    onChange={() => setNotifications(!notifications)}
                                                    size='lg'
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='profile-card'>
                                        <h3 className='card-title'><FaLock className='card-icon' /> Security</h3>

                                        <div className='security-options'>
                                            <button className='security-btn'>
                                                Change Password
                                            </button>
                                            <button className='security-btn'>
                                                Enable Two-Factor Auth
                                            </button>
                                            <button className='security-btn danger'>
                                                Delete Account
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile
