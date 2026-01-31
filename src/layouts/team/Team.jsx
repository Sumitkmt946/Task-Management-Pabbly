import React, { useState, useEffect } from 'react'
import Sidenav from '../../components/sidenav/Sidenav'
import Navbar from '../../components/navbar/Navbar'
import { useToast, Tag } from '@chakra-ui/react'
import { FcStatistics } from "react-icons/fc";
import { IoMdAdd } from "react-icons/io";
import { FaUserEdit, FaTrash } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";
import apiService from '../../services/api';
import AddTeamMemberModal from './modals/AddTeamMemberModal';
import "./team.css"

// Import assets from tasks folder (reuse existing icons)
import totaltasks from '../../assets/tasks/totaltasks.png';
import totalcomplete from '../../assets/tasks/totalcomplete.png';
import totalpending from '../../assets/tasks/totalpending.png';
import totalprogress from '../../assets/tasks/totalprogress.png';

function Team() {
    const [members, setMembers] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editMember, setEditMember] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const toast = useToast();

    const fetchMembers = async () => {
        try {
            const res = await apiService.getTeamMembers();
            setMembers(res);
        } catch (error) {
            console.error(error);
            toast({ title: 'Failed to load team members', status: 'error', duration: 3000, isClosable: true });
        }
    };

    useEffect(() => {
        fetchMembers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDelete = async (id) => {
        const ok = window.confirm('Are you sure you want to remove this team member?');
        if (!ok) return;
        try {
            await apiService.deleteTeamMember(id);
            toast({ title: 'Team member removed', status: 'success', duration: 3000, isClosable: true });
            fetchMembers();
        } catch (error) {
            console.error(error);
            toast({ title: 'Delete failed', status: 'error', duration: 3000, isClosable: true });
        }
    };

    const handleEdit = (member) => {
        setEditMember(member);
        setIsAddModalOpen(true);
    };

    const closeModal = () => {
        setIsAddModalOpen(false);
        setEditMember(null);
    };

    // Filter and search
    const filteredMembers = members.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || member.role === filterRole;
        return matchesSearch && matchesRole;
    });

    // Stats
    const totalMembers = members.length;
    const activeMembers = members.filter(m => m.status === 'Active').length;
    const inactiveMembers = members.filter(m => m.status === 'Inactive').length;
    const roles = [...new Set(members.map(m => m.role))];

    const getRoleColor = (role) => {
        const colors = {
            'Admin': 'red',
            'Developer': 'blue',
            'Designer': 'purple',
            'Manager': 'orange',
            'Tester': 'green',
            'HR': 'pink'
        };
        return colors[role] || 'gray';
    };

    const getStatusColor = (status) => {
        return status === 'Active' ? 'green' : 'red';
    };

    return (
        <>
            <AddTeamMemberModal
                isOpen={isAddModalOpen}
                onClose={closeModal}
                onAdded={fetchMembers}
                editData={editMember}
            />
            <div className='app-main-container'>
                <div className='app-main-left-container'><Sidenav /></div>
                <div className='app-main-right-container'>
                    <Navbar />
                    <div className='dashboard-main-container'>
                        <div className='team-content-container'>
                            {/* Stats Section */}
                            <div className='team-stats-container'>
                                <div className='add-task-inner-div'>
                                    <FcStatistics className='task-stats' />
                                    <p className='todo-text'>Team Statistics</p>
                                </div>
                                <div className='stat-first-row'>
                                    <div className='stats-container container-bg1'>
                                        <img className='stats-icon' src={totaltasks} alt="total" />
                                        <div>
                                            <p className='stats-num'>{totalMembers}</p>
                                            <p className='stats-text'>Total Members</p>
                                        </div>
                                    </div>
                                    <div className='stats-container container-bg4'>
                                        <img className='stats-icon' src={totalcomplete} alt="active" />
                                        <div>
                                            <p className='stats-num'>{activeMembers}</p>
                                            <p className='stats-text'>Active</p>
                                        </div>
                                    </div>
                                    <div className='stats-container container-bg3'>
                                        <img className='stats-icon' src={totalpending} alt="inactive" />
                                        <div>
                                            <p className='stats-num'>{inactiveMembers}</p>
                                            <p className='stats-text'>Inactive</p>
                                        </div>
                                    </div>
                                    <div className='stats-container container-bg2'>
                                        <img className='stats-icon' src={totalprogress} alt="roles" />
                                        <div>
                                            <p className='stats-num'>{roles.length}</p>
                                            <p className='stats-text'>Roles</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Team Header with Search and Add */}
                            <div className='team-header'>
                                <div className='team-header-left'>
                                    <h2 className='team-title'>👥 Team Members</h2>
                                    <div className='team-filters'>
                                        <input
                                            type="text"
                                            placeholder="Search members..."
                                            className='team-search'
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <select
                                            className='team-role-filter'
                                            value={filterRole}
                                            onChange={(e) => setFilterRole(e.target.value)}
                                        >
                                            <option value="all">All Roles</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Developer">Developer</option>
                                            <option value="Designer">Designer</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Tester">Tester</option>
                                            <option value="HR">HR</option>
                                        </select>
                                    </div>
                                </div>
                                <button className='table-btn-task' onClick={() => setIsAddModalOpen(true)}>
                                    <IoMdAdd /> Add Member
                                </button>
                            </div>

                            {/* Team Cards Grid */}
                            <div className='team-grid'>
                                {filteredMembers.length === 0 ? (
                                    <p className='no-members'>No team members found</p>
                                ) : (
                                    filteredMembers.map(member => (
                                        <div key={member._id} className='team-card'>
                                            <div className='team-card-header'>
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0D9488&color=ffffff&rounded=true&size=80`}
                                                    alt={member.name}
                                                    className='team-avatar'
                                                />
                                                <Tag
                                                    size='sm'
                                                    colorScheme={getStatusColor(member.status)}
                                                    className='status-badge'
                                                >
                                                    {member.status}
                                                </Tag>
                                            </div>
                                            <div className='team-card-body'>
                                                <h3 className='member-name'>{member.name}</h3>
                                                <Tag
                                                    size='md'
                                                    colorScheme={getRoleColor(member.role)}
                                                    borderRadius='full'
                                                    mb={2}
                                                >
                                                    {member.role}
                                                </Tag>
                                                <div className='member-contact'>
                                                    <p><MdEmail className='contact-icon' /> {member.email}</p>
                                                    <p><MdPhone className='contact-icon' /> {member.phone}</p>
                                                </div>
                                                <p className='member-department'>{member.department}</p>
                                            </div>
                                            <div className='team-card-footer'>
                                                <button
                                                    className='team-btn edit-btn'
                                                    onClick={() => handleEdit(member)}
                                                >
                                                    <FaUserEdit /> Edit
                                                </button>
                                                <button
                                                    className='team-btn delete-btn'
                                                    onClick={() => handleDelete(member._id)}
                                                >
                                                    <FaTrash /> Remove
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

export default Team
