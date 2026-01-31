import axios from 'axios';

// Check if backend is available
let isBackendAvailable = null;

const checkBackend = async () => {
    if (isBackendAvailable !== null) return isBackendAvailable;
    try {
        await axios.get('/api/health', { timeout: 2000 });
        isBackendAvailable = true;
    } catch {
        isBackendAvailable = false;
    }
    return isBackendAvailable;
};

// Mock data stored in localStorage
const MOCK_TASKS_KEY = 'mock_tasks';

const getInitialMockTasks = () => {
    const stored = localStorage.getItem(MOCK_TASKS_KEY);
    if (stored) return JSON.parse(stored);

    // Default mock tasks
    const defaultTasks = [
        {
            _id: 'mock_1',
            title: 'Complete Project Documentation',
            description: 'Write comprehensive documentation for the Task Management System including API docs, user guide, and developer setup instructions.',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'Most Important',
            status: 'To-Do',
            createdAt: new Date().toISOString()
        },
        {
            _id: 'mock_2',
            title: 'Design Dashboard UI',
            description: 'Create mockups and implement the main dashboard with statistics, charts, and quick action buttons.',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'Important',
            status: 'In Progress',
            createdAt: new Date().toISOString()
        },
        {
            _id: 'mock_3',
            title: 'Setup CI/CD Pipeline',
            description: 'Configure GitHub Actions for automated testing and deployment to staging environment.',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'Least Important',
            status: 'To-Do',
            createdAt: new Date().toISOString()
        },
        {
            _id: 'mock_4',
            title: 'Fix Login Authentication',
            description: 'Resolved token expiration issue and improved error handling for failed login attempts.',
            dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'Most Important',
            status: 'Completed',
            createdAt: new Date().toISOString()
        },
        {
            _id: 'mock_5',
            title: 'Add Task Filtering',
            description: 'Implement filters for tasks by status, priority, and due date in the tasks list view.',
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'Important',
            status: 'In Progress',
            createdAt: new Date().toISOString()
        }
    ];

    localStorage.setItem(MOCK_TASKS_KEY, JSON.stringify(defaultTasks));
    return defaultTasks;
};

const saveMockTasks = (tasks) => {
    localStorage.setItem(MOCK_TASKS_KEY, JSON.stringify(tasks));
};

// API Service
const apiService = {
    // Get all tasks with pagination
    getTasks: async (page = 1, limit = 6) => {
        const backendUp = await checkBackend();

        if (backendUp) {
            const token = localStorage.getItem('tm_token');
            const res = await axios.get(`/api/tasks?page=${page}&limit=${limit}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }

        // Mock response
        const tasks = getInitialMockTasks();
        const start = (page - 1) * limit;
        const paginatedTasks = tasks.slice(start, start + limit);

        return {
            data: paginatedTasks,
            page,
            pages: Math.ceil(tasks.length / limit),
            total: tasks.length
        };
    },

    // Get task summary
    getTasksSummary: async () => {
        const backendUp = await checkBackend();

        if (backendUp) {
            const token = localStorage.getItem('tm_token');
            const res = await axios.get('/api/tasks/summary', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }

        // Mock summary
        const tasks = getInitialMockTasks();
        const total = tasks.length;
        const todo = tasks.filter(t => t.status === 'To-Do').length;
        const inProgress = tasks.filter(t => t.status === 'In Progress').length;
        const completed = tasks.filter(t => t.status === 'Completed').length;

        return {
            total,
            todo,
            inProgress,
            completed,
            percentTodo: total ? Math.round((todo / total) * 100) : 0,
            percentInProgress: total ? Math.round((inProgress / total) * 100) : 0,
            percentCompleted: total ? Math.round((completed / total) * 100) : 0
        };
    },

    // Get single task
    getTask: async (id) => {
        const backendUp = await checkBackend();

        if (backendUp) {
            const token = localStorage.getItem('tm_token');
            const res = await axios.get(`/api/task/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }

        // Mock
        const tasks = getInitialMockTasks();
        const task = tasks.find(t => t._id === id);
        if (!task) throw new Error('Task not found');
        return task;
    },

    // Create task
    createTask: async (taskData) => {
        const backendUp = await checkBackend();

        if (backendUp) {
            const token = localStorage.getItem('tm_token');
            const res = await axios.post('/api/task', taskData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }

        // Mock
        const tasks = getInitialMockTasks();
        const newTask = {
            _id: 'mock_' + Date.now(),
            ...taskData,
            createdAt: new Date().toISOString()
        };
        tasks.unshift(newTask);
        saveMockTasks(tasks);

        return { message: 'Task created successfully', task: newTask };
    },

    // Update task
    updateTask: async (id, taskData) => {
        const backendUp = await checkBackend();

        if (backendUp) {
            const token = localStorage.getItem('tm_token');
            const res = await axios.put(`/api/task/${id}`, taskData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }

        // Mock
        const tasks = getInitialMockTasks();
        const index = tasks.findIndex(t => t._id === id);
        if (index === -1) throw new Error('Task not found');

        tasks[index] = { ...tasks[index], ...taskData };
        saveMockTasks(tasks);

        return { message: 'Task updated successfully', task: tasks[index] };
    },

    // Delete task
    deleteTask: async (id) => {
        const backendUp = await checkBackend();

        if (backendUp) {
            const token = localStorage.getItem('tm_token');
            const res = await axios.delete(`/api/task/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }

        // Mock
        const tasks = getInitialMockTasks();
        const filteredTasks = tasks.filter(t => t._id !== id);
        saveMockTasks(filteredTasks);

        return { message: 'Task deleted successfully' };
    },

    // Login
    login: async (email, password) => {
        const backendUp = await checkBackend();

        if (backendUp) {
            const res = await axios.post('/api/login', { email, password });
            return res.data;
        }

        // Mock login
        const mockToken = 'mock_token_' + Date.now();
        const mockUser = {
            id: 1,
            name: email.split('@')[0],
            email,
            role: 'admin'
        };

        return { token: mockToken, user: mockUser };
    },

    // Get profile
    getProfile: async () => {
        const backendUp = await checkBackend();

        if (backendUp) {
            const token = localStorage.getItem('tm_token');
            const res = await axios.get('/api/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }

        // Mock profile
        const storedUser = localStorage.getItem('tm_user');
        if (storedUser) return JSON.parse(storedUser);

        return {
            id: 1,
            name: 'Demo User',
            email: 'demo@example.com',
            role: 'admin'
        };
    },

    // Reset mock data (for testing)
    resetMockData: () => {
        localStorage.removeItem(MOCK_TASKS_KEY);
        localStorage.removeItem(MOCK_TEAM_KEY);
        getInitialMockTasks();
        getInitialMockTeam();
    },

    // Check if using mock mode
    isMockMode: async () => {
        return !(await checkBackend());
    },

    // ========== TEAM MEMBERS API ==========

    // Get all team members
    getTeamMembers: async () => {
        const backendUp = await checkBackend();

        if (backendUp) {
            const token = localStorage.getItem('tm_token');
            const res = await axios.get('/api/team', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }

        // Mock response
        return getInitialMockTeam();
    },

    // Get single team member
    getTeamMember: async (id) => {
        const backendUp = await checkBackend();

        if (backendUp) {
            const token = localStorage.getItem('tm_token');
            const res = await axios.get(`/api/team/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }

        // Mock
        const members = getInitialMockTeam();
        const member = members.find(m => m._id === id);
        if (!member) throw new Error('Team member not found');
        return member;
    },

    // Create team member
    createTeamMember: async (memberData) => {
        const backendUp = await checkBackend();

        if (backendUp) {
            const token = localStorage.getItem('tm_token');
            const res = await axios.post('/api/team', memberData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }

        // Mock
        const members = getInitialMockTeam();
        const newMember = {
            _id: 'member_' + Date.now(),
            ...memberData,
            createdAt: new Date().toISOString()
        };
        members.unshift(newMember);
        saveMockTeam(members);

        return { message: 'Team member added successfully', member: newMember };
    },

    // Update team member
    updateTeamMember: async (id, memberData) => {
        const backendUp = await checkBackend();

        if (backendUp) {
            const token = localStorage.getItem('tm_token');
            const res = await axios.put(`/api/team/${id}`, memberData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }

        // Mock
        const members = getInitialMockTeam();
        const index = members.findIndex(m => m._id === id);
        if (index === -1) throw new Error('Team member not found');

        members[index] = { ...members[index], ...memberData };
        saveMockTeam(members);

        return { message: 'Team member updated successfully', member: members[index] };
    },

    // Delete team member
    deleteTeamMember: async (id) => {
        const backendUp = await checkBackend();

        if (backendUp) {
            const token = localStorage.getItem('tm_token');
            const res = await axios.delete(`/api/team/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }

        // Mock
        const members = getInitialMockTeam();
        const filteredMembers = members.filter(m => m._id !== id);
        saveMockTeam(filteredMembers);

        return { message: 'Team member removed successfully' };
    }
};

// ========== TEAM MOCK DATA ==========
const MOCK_TEAM_KEY = 'mock_team';

const getInitialMockTeam = () => {
    const stored = localStorage.getItem(MOCK_TEAM_KEY);
    if (stored) return JSON.parse(stored);

    // Default mock team members
    const defaultTeam = [
        {
            _id: 'member_1',
            name: 'Rahul Sharma',
            email: 'rahul.sharma@company.com',
            phone: '+91 98765 43210',
            role: 'Admin',
            department: 'Management',
            status: 'Active',
            createdAt: new Date().toISOString()
        },
        {
            _id: 'member_2',
            name: 'Priya Patel',
            email: 'priya.patel@company.com',
            phone: '+91 87654 32109',
            role: 'Developer',
            department: 'Engineering',
            status: 'Active',
            createdAt: new Date().toISOString()
        },
        {
            _id: 'member_3',
            name: 'Amit Kumar',
            email: 'amit.kumar@company.com',
            phone: '+91 76543 21098',
            role: 'Designer',
            department: 'Design',
            status: 'Active',
            createdAt: new Date().toISOString()
        },
        {
            _id: 'member_4',
            name: 'Sneha Gupta',
            email: 'sneha.gupta@company.com',
            phone: '+91 65432 10987',
            role: 'Manager',
            department: 'Operations',
            status: 'Active',
            createdAt: new Date().toISOString()
        },
        {
            _id: 'member_5',
            name: 'Vikram Singh',
            email: 'vikram.singh@company.com',
            phone: '+91 54321 09876',
            role: 'Tester',
            department: 'Quality Assurance',
            status: 'Inactive',
            createdAt: new Date().toISOString()
        },
        {
            _id: 'member_6',
            name: 'Anjali Verma',
            email: 'anjali.verma@company.com',
            phone: '+91 43210 98765',
            role: 'HR',
            department: 'Human Resources',
            status: 'Active',
            createdAt: new Date().toISOString()
        }
    ];

    localStorage.setItem(MOCK_TEAM_KEY, JSON.stringify(defaultTeam));
    return defaultTeam;
};

const saveMockTeam = (members) => {
    localStorage.setItem(MOCK_TEAM_KEY, JSON.stringify(members));
};

// ========== PROJECTS MOCK DATA ==========
const MOCK_PROJECTS_KEY = 'mock_projects';

const getInitialMockProjects = () => {
    const stored = localStorage.getItem(MOCK_PROJECTS_KEY);
    if (stored) return JSON.parse(stored);

    // Default mock projects
    const defaultProjects = [
        {
            _id: 'project_1',
            name: 'Task Management System',
            description: 'A comprehensive task management application with team collaboration features, task tracking, and progress monitoring.',
            status: 'In Progress',
            priority: 'High',
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            progress: 65,
            tasksCount: 12,
            createdAt: new Date().toISOString()
        },
        {
            _id: 'project_2',
            name: 'E-Commerce Platform',
            description: 'Online shopping platform with cart, payment gateway integration, and order management system.',
            status: 'Pending',
            priority: 'Medium',
            deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            progress: 15,
            tasksCount: 24,
            createdAt: new Date().toISOString()
        },
        {
            _id: 'project_3',
            name: 'Mobile App Redesign',
            description: 'Complete UI/UX redesign of the mobile application with new design system and improved user experience.',
            status: 'Completed',
            priority: 'High',
            deadline: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            progress: 100,
            tasksCount: 8,
            createdAt: new Date().toISOString()
        },
        {
            _id: 'project_4',
            name: 'API Integration',
            description: 'Third-party API integrations including payment, maps, and social media authentication.',
            status: 'In Progress',
            priority: 'Medium',
            deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            progress: 40,
            tasksCount: 6,
            createdAt: new Date().toISOString()
        },
        {
            _id: 'project_5',
            name: 'Documentation & Training',
            description: 'Create comprehensive documentation and training materials for all team members.',
            status: 'On Hold',
            priority: 'Low',
            deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
            progress: 20,
            tasksCount: 4,
            createdAt: new Date().toISOString()
        }
    ];

    localStorage.setItem(MOCK_PROJECTS_KEY, JSON.stringify(defaultProjects));
    return defaultProjects;
};

const saveMockProjects = (projects) => {
    localStorage.setItem(MOCK_PROJECTS_KEY, JSON.stringify(projects));
};

// Add project methods to apiService
apiService.getProjects = async () => {
    const backendUp = await checkBackend();

    if (backendUp) {
        const token = localStorage.getItem('tm_token');
        const res = await axios.get('/api/projects', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    }

    return getInitialMockProjects();
};

apiService.getProject = async (id) => {
    const backendUp = await checkBackend();

    if (backendUp) {
        const token = localStorage.getItem('tm_token');
        const res = await axios.get(`/api/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    }

    const projects = getInitialMockProjects();
    const project = projects.find(p => p._id === id);
    if (!project) throw new Error('Project not found');
    return project;
};

apiService.createProject = async (projectData) => {
    const backendUp = await checkBackend();

    if (backendUp) {
        const token = localStorage.getItem('tm_token');
        const res = await axios.post('/api/projects', projectData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    }

    const projects = getInitialMockProjects();
    const newProject = {
        _id: 'project_' + Date.now(),
        ...projectData,
        createdAt: new Date().toISOString()
    };
    projects.unshift(newProject);
    saveMockProjects(projects);

    return { message: 'Project created successfully', project: newProject };
};

apiService.updateProject = async (id, projectData) => {
    const backendUp = await checkBackend();

    if (backendUp) {
        const token = localStorage.getItem('tm_token');
        const res = await axios.put(`/api/projects/${id}`, projectData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    }

    const projects = getInitialMockProjects();
    const index = projects.findIndex(p => p._id === id);
    if (index === -1) throw new Error('Project not found');

    projects[index] = { ...projects[index], ...projectData };
    saveMockProjects(projects);

    return { message: 'Project updated successfully', project: projects[index] };
};

apiService.deleteProject = async (id) => {
    const backendUp = await checkBackend();

    if (backendUp) {
        const token = localStorage.getItem('tm_token');
        const res = await axios.delete(`/api/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    }

    const projects = getInitialMockProjects();
    const filteredProjects = projects.filter(p => p._id !== id);
    saveMockProjects(filteredProjects);

    return { message: 'Project deleted successfully' };
};

export default apiService;
