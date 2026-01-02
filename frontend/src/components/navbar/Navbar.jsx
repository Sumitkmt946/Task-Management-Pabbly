import * as React from 'react';
import "./navbar.css";
import { IoIosNotifications } from "react-icons/io";
import { IoIosSearch } from "react-icons/io";
function Navbar() {
    const now = new Date();
    const dayName = now.toLocaleDateString(undefined, { weekday: 'long' });
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const formatted = `${dd}/${mm}/${yyyy}`;

    return (
        <div className='nav-main-container'>
            <div><p className='nav-main-text'>Dash<span>Board</span></p></div>
            <div className='nav-search-container'>
                <input placeholder='Search your task here...' />
                <div className='task-read'>
                    <IoIosSearch className='read-icon' />
                </div>
            </div>
            <div className='nav-notification-container'>
                <div className='task-read'>
                    <IoIosNotifications  className='read-icon' />
                </div>
                <div>
                    <p className='nav-day-text'>{dayName}</p>
                    <p className='nav-date-text'>{formatted}</p>
                </div>
            </div>
        </div>
    )
}
export default Navbar