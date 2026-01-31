import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Register from './layouts/auth/Register.jsx';
import Login from './layouts/auth/Login.jsx';
import Logout from './layouts/auth/Logout.jsx';
import Dashboard from './layouts/dashboard/Dashboard.jsx';
import Tasks from './layouts/tasks/Tasks.jsx'
import TaskDetails from './layouts/tasks/TaskDetails.jsx'
import Settings from './layouts/settings/Settings.jsx'
import Team from './layouts/team/Team.jsx'
import Projects from './layouts/projects/Projects.jsx'
import Profile from './layouts/profile/Profile.jsx'

function App() {
  // Initialize dark mode from localStorage on app load
  useEffect(() => {
    const darkMode = localStorage.getItem('tm_darkMode') === 'true';
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Listen for dark mode changes from Profile page
    const handleDarkModeChange = () => {
      const isDark = localStorage.getItem('tm_darkMode') === 'true';
      if (isDark) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    };

    window.addEventListener('storage', handleDarkModeChange);
    return () => window.removeEventListener('storage', handleDarkModeChange);
  }, []);

  return (
    <>

      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/admin/dashboard' element={<Dashboard />} />
          <Route path='/admin/tasks' element={<Tasks />} />
          <Route path='/admin/tasks/:id' element={<TaskDetails />} />
          <Route path='/admin/team' element={<Team />} />
          <Route path='/admin/projects' element={<Projects />} />
          <Route path='/admin/profile' element={<Profile />} />
          <Route path='/admin/settings' element={<Settings />} />
        </Routes>
      </Router>
    </>
  )
}

export default App;