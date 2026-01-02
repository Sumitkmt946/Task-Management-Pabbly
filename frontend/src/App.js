import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './layouts/auth/Register.jsx';
import Login from './layouts/auth/Login.jsx';
import Logout from './layouts/auth/Logout.jsx';
import Dashboard from './layouts/dashboard/Dashboard.jsx';
import Tasks from './layouts/tasks/Tasks.jsx'
import TaskDetails from './layouts/tasks/TaskDetails.jsx'
import Settings from './layouts/settings/Settings.jsx'

function App() {
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
          <Route path='/admin/settings' element={<Settings />} />
        </Routes>
      </Router>
    </>
  )
}

export default App;