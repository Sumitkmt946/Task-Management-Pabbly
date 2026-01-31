import React, { useState, useEffect } from 'react'
import Sidenav from '../../components/sidenav/Sidenav'
import { CircularProgress, CircularProgressLabel, useToast } from '@chakra-ui/react'
import "./tasks.css"
import pending from '../../assets/tasks/Pending.png';
import complete from '../../assets/tasks/complete.png';
import book from '../../assets/tasks/Book.png';
import totaltasks from '../../assets/tasks/totaltasks.png';
import totalprogress from '../../assets/tasks/totalprogress.png';
import totalpending from '../../assets/tasks/totalpending.png';
import totalcomplete from '../../assets/tasks/totalcomplete.png';
import { IoReaderOutline } from "react-icons/io5";
import { FcStatistics } from "react-icons/fc";
import Navbar from '../../components/navbar/Navbar'
import { Tag } from '@chakra-ui/react'
import AddTaskModal from './modals/AddTask';
import TaskDetailsModal from './modals/TaskDetailsModal';
import { useNavigate } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import apiService from '../../services/api';

function Tasks() {
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [limit] = useState(6);
    const toast = useToast();
    const [summary, setSummary] = useState({ total: 0, todo: 0, inProgress: 0, completed: 0, percentTodo: 0, percentInProgress: 0, percentCompleted: 0 });
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const navigate = useNavigate();

    const openAddTaskModal = () => {
        setIsAddTaskModalOpen(true);
    };
    const closeAddTaskModal = () => {
        setIsAddTaskModalOpen(false);
    };
    // read modal removed — navigation to details page is used instead

    const fetchTasks = async (p = page) => {
        try {
            const res = await apiService.getTasks(p, limit);
            setTasks(res.data);
            setPages(res.pages || 1);
            setPage(res.page || 1);
            // fetch summary too
            fetchSummary();
        } catch (error) {
            console.error(error);
            toast({ title: 'Failed to load tasks', status: 'error', duration: 3000, isClosable: true });
        }
    };

    const fetchSummary = async () => {
        try {
            const res = await apiService.getTasksSummary();
            setSummary(res);
        } catch (err) {
            console.error('Summary error', err);
        }
    }

    useEffect(() => {
        fetchTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDelete = async (id) => {
        const ok = window.confirm('Are you sure you want to delete this task?');
        if (!ok) return;
        try {
            await apiService.deleteTask(id);
            toast({ title: 'Task deleted', status: 'success', duration: 3000, isClosable: true });
            fetchTasks(page);
        } catch (error) {
            console.error(error);
            toast({ title: 'Delete failed', status: 'error', duration: 3000, isClosable: true });
        }
    };

    const goPrev = () => {
        if (page > 1) fetchTasks(page - 1);
    };
    const goNext = () => {
        if (page < pages) fetchTasks(page + 1);
    };
    return (
        <>
            <AddTaskModal isOpen={isAddTaskModalOpen} onClose={closeAddTaskModal} onAdded={fetchTasks} />
            <TaskDetailsModal isOpen={isDetailsOpen} onClose={() => { setIsDetailsOpen(false); setSelectedTaskId(null); }} taskId={selectedTaskId} onUpdated={() => fetchTasks(page)} />
            <div className='app-main-container'>
                <div className='app-main-left-container'><Sidenav /></div>
                <div className='app-main-right-container'>
                    <Navbar />
                    <div className='dashboard-main-container'>
                        <div className='dashboard-main-left-container'>
                            <div className='task-status-card-container'>
                                <div className='add-task-inner-div'>
                                    <FcStatistics className='task-stats' />
                                    <p className='todo-text'>Tasks Statistics</p>
                                </div>
                                <div className='stat-first-row'>
                                    <div className='stats-container container-bg1'>
                                        <img className='stats-icon' src={totaltasks} alt="totaltasks" />
                                        <div>
                                            <p className='stats-num'>{summary.total}</p>
                                            <p className='stats-text'>Total Task</p>
                                        </div>
                                    </div>
                                    <div className='stats-container container-bg4'>
                                        <img className='stats-icon' src={totalcomplete} alt="totalcomplete" />
                                        <div>
                                            <p className='stats-num'>{summary.completed}</p>
                                            <p className='stats-text'>Completed</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='stat-second-row'>
                                    <div className='stats-container container-bg2'>
                                        <img className='stats-icon' src={totalprogress} alt="totalprogress" />
                                        <div>
                                            <p className='stats-num'>{summary.inProgress}</p>
                                            <p className='stats-text'>In Progress</p>
                                        </div>
                                    </div>
                                    <div className='stats-container container-bg3'>
                                        <img className='stats-icon' src={totalpending} alt="totalpending" />
                                        <div>
                                            <p className='stats-num'>{summary.todo}</p>
                                            <p className='stats-text'>Pending</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='add-task-main-container'>
                                <div className='add-task-main-div'>
                                    <div className='add-task-inner-div'>
                                        <img src={pending} alt="pending" />
                                        <p className='todo-text'>To-Do Tasks</p>
                                    </div>
                                    <button className='table-btn-task' onClick={openAddTaskModal}><IoMdAdd />Add Task</button>
                                </div>
                                {tasks.filter(task => task.status === 'To-Do').length === 0 && <p>No tasks yet</p>}
                                {tasks.filter(task => task.status === 'To-Do').map(task => (
                                    <div key={task._id} className='task-card-container'>
                                        <p className='task-title'>{task.title}</p>
                                        <div className='task-desc-container'>
                                            <p className='task-desc'>{task.description}</p>
                                        </div>
                                        <div className='task-card-footer-container'>
                                            <div>
                                                <Tag size='lg' colorScheme={task.priority === 'Most Important' ? 'red' : task.priority === 'Important' ? 'yellow' : 'green'} borderRadius='full'>
                                                    <p className='tag-text'>{task.priority}</p>
                                                </Tag>
                                            </div>
                                            <div>
                                                <div className='task-read' onClick={() => { setSelectedTaskId(task._id); setIsDetailsOpen(true); }}>
                                                    <IoReaderOutline className='read-icon' />
                                                </div>
                                            </div>
                                            <div>
                                                <button className='table-btn-task delete-btn' onClick={() => handleDelete(task._id)}>Delete</button>
                                            </div>
                                        </div>
                                        <p className='created'>Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='dashboard-main-right-container'>
                            <div className='task-status-card-container'>
                                <div className='add-task-inner-div'>
                                    <img src={complete} alt="complete" />
                                    <p className='todo-text'>Tasks Status</p>
                                </div>
                                <div className='task-status-progress-main-container'>
                                    <div>
                                        <CircularProgress value={summary.percentCompleted} color='#05A301' size={'100px'}>
                                            <CircularProgressLabel>{summary.percentCompleted}%</CircularProgressLabel>
                                        </CircularProgress>
                                        <p className='completed'>Completed</p>
                                    </div>
                                    <div>
                                        <CircularProgress value={summary.percentInProgress} color='#0225FF' size={'100px'}>
                                            <CircularProgressLabel>{summary.percentInProgress}%</CircularProgressLabel>
                                        </CircularProgress>
                                        <p className='progress'>In Progress</p>
                                    </div>

                                </div>
                            </div>
                            <div className='add-task-main-container'>
                                <div className='add-task-main-div'>
                                    <div className='add-task-inner-div'>
                                        <img src={book} alt="Book" />
                                        <p className='todo-text'>In Progress Tasks</p>
                                    </div>
                                </div>
                                {tasks.filter(task => task.status === 'In Progress').map(task => (
                                    <div key={task._id} className='task-card-container'>
                                        <p className='task-title'>{task.title}</p>
                                        <div className='task-desc-container'>
                                            <p className='task-desc'>{task.description}</p>
                                        </div>
                                        <div className='task-card-footer-container'>
                                            <div>
                                                <Tag size='lg' colorScheme='blue' borderRadius='full'>
                                                    <p className='tag-text'>In Progress</p>
                                                </Tag>
                                            </div>
                                            <div>
                                                <div className='task-read' onClick={() => { setSelectedTaskId(task._id); setIsDetailsOpen(true); }}>
                                                    <IoReaderOutline className='read-icon' />
                                                </div>
                                            </div>
                                            <div>
                                                <button className='table-btn-task delete-btn' onClick={() => handleDelete(task._id)}>Delete</button>
                                            </div>
                                        </div>
                                        <p className='created'>Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                ))}
                            </div>
                            <div className='add-task-main-container'>
                                <div className='add-task-main-div'>
                                    <div className='add-task-inner-div'>
                                        <img src={book} alt="Book" />
                                        <p className='todo-text'>Completed Tasks</p>
                                    </div>
                                </div>
                                {tasks.filter(task => task.status === 'Completed').map(task => (
                                    <div key={task._id} className='task-card-container'>
                                        <p className='task-title'>{task.title}</p>
                                        <div className='task-desc-container'>
                                            <p className='task-desc'>{task.description}</p>
                                        </div>
                                        <div className='task-card-footer-container'>
                                            <div>
                                                <Tag size='lg' colorScheme='green' borderRadius='full'>
                                                    <p className='tag-text'>Completed</p>
                                                </Tag>
                                            </div>
                                            <div>
                                                <div className='task-read' onClick={() => { setSelectedTaskId(task._id); setIsDetailsOpen(true); }}>
                                                    <IoReaderOutline className='read-icon' />
                                                </div>
                                            </div>
                                            <div>
                                                <button className='table-btn-task delete-btn' onClick={() => handleDelete(task._id)}>Delete</button>
                                            </div>
                                        </div>
                                        <p className='created'>{task.dueDate ? `Due Date: ${new Date(task.dueDate).toLocaleDateString()}` : 'Completed'}</p>
                                    </div>
                                ))}


                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}

export default Tasks