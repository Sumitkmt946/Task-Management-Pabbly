import React, { useState, useEffect } from 'react'
import Sidenav from '../../components/sidenav/Sidenav'
import Navbar from '../../components/navbar/Navbar'
import { useToast, Progress, Tag } from '@chakra-ui/react'
import { FcStatistics } from "react-icons/fc";
import { IoMdAdd } from "react-icons/io";
import { FaEdit, FaTrash, FaTasks } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import apiService from '../../services/api';
import AddProjectModal from './modals/AddProjectModal';
import "./projects.css"

import totaltasks from '../../assets/tasks/totaltasks.png';
import totalcomplete from '../../assets/tasks/totalcomplete.png';
import totalpending from '../../assets/tasks/totalpending.png';
import totalprogress from '../../assets/tasks/totalprogress.png';

function Projects() {
    const [projects, setProjects] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editProject, setEditProject] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const toast = useToast();

    const fetchProjects = async () => {
        try {
            const res = await apiService.getProjects();
            setProjects(res);
        } catch (error) {
            console.error(error);
            toast({ title: 'Failed to load projects', status: 'error', duration: 3000, isClosable: true });
        }
    };

    useEffect(() => {
        fetchProjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDelete = async (id) => {
        const ok = window.confirm('Are you sure you want to delete this project?');
        if (!ok) return;
        try {
            await apiService.deleteProject(id);
            toast({ title: 'Project deleted', status: 'success', duration: 3000, isClosable: true });
            fetchProjects();
        } catch (error) {
            console.error(error);
            toast({ title: 'Delete failed', status: 'error', duration: 3000, isClosable: true });
        }
    };

    const handleEdit = (project) => {
        setEditProject(project);
        setIsAddModalOpen(true);
    };

    const closeModal = () => {
        setIsAddModalOpen(false);
        setEditProject(null);
    };

    // Filter and search
    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Stats
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;
    const inProgressProjects = projects.filter(p => p.status === 'In Progress').length;
    const pendingProjects = projects.filter(p => p.status === 'Pending').length;

    const getStatusColor = (status) => {
        const colors = {
            'Completed': 'green',
            'In Progress': 'blue',
            'Pending': 'orange',
            'On Hold': 'red'
        };
        return colors[status] || 'gray';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'High': 'red',
            'Medium': 'yellow',
            'Low': 'green'
        };
        return colors[priority] || 'gray';
    };

    return (
        <>
            <AddProjectModal
                isOpen={isAddModalOpen}
                onClose={closeModal}
                onAdded={fetchProjects}
                editData={editProject}
            />
            <div className='app-main-container'>
                <div className='app-main-left-container'><Sidenav /></div>
                <div className='app-main-right-container'>
                    <Navbar />
                    <div className='dashboard-main-container'>
                        <div className='projects-content-container'>
                            {/* Stats Section */}
                            <div className='projects-stats-container'>
                                <div className='add-task-inner-div'>
                                    <FcStatistics className='task-stats' />
                                    <p className='todo-text'>Project Statistics</p>
                                </div>
                                <div className='stat-first-row'>
                                    <div className='stats-container container-bg1'>
                                        <img className='stats-icon' src={totaltasks} alt="total" />
                                        <div>
                                            <p className='stats-num'>{totalProjects}</p>
                                            <p className='stats-text'>Total Projects</p>
                                        </div>
                                    </div>
                                    <div className='stats-container container-bg4'>
                                        <img className='stats-icon' src={totalcomplete} alt="completed" />
                                        <div>
                                            <p className='stats-num'>{completedProjects}</p>
                                            <p className='stats-text'>Completed</p>
                                        </div>
                                    </div>
                                    <div className='stats-container container-bg2'>
                                        <img className='stats-icon' src={totalprogress} alt="progress" />
                                        <div>
                                            <p className='stats-num'>{inProgressProjects}</p>
                                            <p className='stats-text'>In Progress</p>
                                        </div>
                                    </div>
                                    <div className='stats-container container-bg3'>
                                        <img className='stats-icon' src={totalpending} alt="pending" />
                                        <div>
                                            <p className='stats-num'>{pendingProjects}</p>
                                            <p className='stats-text'>Pending</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Projects Header */}
                            <div className='projects-header'>
                                <div className='projects-header-left'>
                                    <h2 className='projects-title'>📁 Projects</h2>
                                    <div className='projects-filters'>
                                        <input
                                            type="text"
                                            placeholder="Search projects..."
                                            className='projects-search'
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <select
                                            className='projects-status-filter'
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                        >
                                            <option value="all">All Status</option>
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                            <option value="On Hold">On Hold</option>
                                        </select>
                                    </div>
                                </div>
                                <button className='table-btn-task' onClick={() => setIsAddModalOpen(true)}>
                                    <IoMdAdd /> New Project
                                </button>
                            </div>

                            {/* Projects Grid */}
                            <div className='projects-grid'>
                                {filteredProjects.length === 0 ? (
                                    <p className='no-projects'>No projects found</p>
                                ) : (
                                    filteredProjects.map(project => (
                                        <div key={project._id} className='project-card'>
                                            <div className='project-card-header'>
                                                <h3 className='project-name'>{project.name}</h3>
                                                <div className='project-badges'>
                                                    <Tag size='sm' colorScheme={getStatusColor(project.status)}>
                                                        {project.status}
                                                    </Tag>
                                                    <Tag size='sm' colorScheme={getPriorityColor(project.priority)}>
                                                        {project.priority}
                                                    </Tag>
                                                </div>
                                            </div>

                                            <p className='project-description'>{project.description}</p>

                                            <div className='project-progress-section'>
                                                <div className='progress-header'>
                                                    <span>Progress</span>
                                                    <span>{project.progress}%</span>
                                                </div>
                                                <Progress
                                                    value={project.progress}
                                                    colorScheme={project.progress === 100 ? 'green' : 'teal'}
                                                    size='sm'
                                                    borderRadius='full'
                                                />
                                            </div>

                                            <div className='project-meta'>
                                                <div className='project-meta-item'>
                                                    <FaTasks className='meta-icon' />
                                                    <span>{project.tasksCount} Tasks</span>
                                                </div>
                                                <div className='project-meta-item'>
                                                    <MdDateRange className='meta-icon' />
                                                    <span>{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}</span>
                                                </div>
                                            </div>

                                            <div className='project-card-footer'>
                                                <button
                                                    className='project-btn edit-btn'
                                                    onClick={() => handleEdit(project)}
                                                >
                                                    <FaEdit /> Edit
                                                </button>
                                                <button
                                                    className='project-btn delete-btn'
                                                    onClick={() => handleDelete(project._id)}
                                                >
                                                    <FaTrash /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Projects
