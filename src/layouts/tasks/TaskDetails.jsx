import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast, Button, Input, Textarea, Select } from '@chakra-ui/react';
import apiService from '../../services/api';

function TaskDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [task, setTask] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', dueDate: '', priority: 'Most Important', status: 'To-Do' });

    const fetchTask = async () => {
        try {
            const res = await apiService.getTask(id);
            setTask(res);
            setForm({ title: res.title || '', description: res.description || '', dueDate: res.dueDate ? new Date(res.dueDate).toISOString().split('T')[0] : '', priority: res.priority || 'Most Important', status: res.status || 'To-Do' });
        } catch (err) {
            console.error(err);
            toast({ title: 'Failed to load task', status: 'error' });
        }
    };

    useEffect(() => { fetchTask(); }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSave = async () => {
        try {
            await apiService.updateTask(id, form);
            toast({ title: 'Task updated', status: 'success' });
            setEditing(false);
            fetchTask();
        } catch (err) {
            console.error(err);
            toast({ title: 'Update failed', status: 'error' });
        }
    };

    const handleDelete = async () => {
        const ok = window.confirm('Are you sure you want to delete this task?');
        if (!ok) return;
        try {
            await apiService.deleteTask(id);
            toast({ title: 'Task deleted', status: 'success' });
            navigate('/admin/tasks');
        } catch (err) {
            console.error(err);
            toast({ title: 'Delete failed', status: 'error' });
        }
    };

    const updateStatus = async (newStatus) => {
        try {
            await apiService.updateTask(id, { status: newStatus });
            toast({ title: 'Status updated', status: 'success' });
            fetchTask();
        } catch (err) {
            console.error(err);
            toast({ title: 'Status update failed', status: 'error' });
        }
    };

    if (!task) return <div>Loading...</div>;

    return (
        <div style={{ padding: 20 }}>
            <h2>{task.title}</h2>
            {!editing ? (
                <>
                    <p><strong>Description:</strong></p>
                    <p>{task.description}</p>
                    <p><strong>Due Date:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Priority:</strong> {task.priority}</p>
                    <p><strong>Status:</strong> {task.status}</p>
                    <div style={{ marginTop: 12 }}>
                        <Button colorScheme='blue' mr={2} onClick={() => setEditing(true)}>Edit</Button>
                        <Button colorScheme='green' mr={2} onClick={() => updateStatus('In Progress')}>Mark In Progress</Button>
                        <Button colorScheme='teal' mr={2} onClick={() => updateStatus('To-Do')}>Mark To-Do</Button>
                        <Button colorScheme='purple' mr={2} onClick={() => updateStatus('Completed')}>Mark Completed</Button>
                        <Button colorScheme='red' onClick={handleDelete}>Delete</Button>
                    </div>
                </>
            ) : (
                <div style={{ maxWidth: 600 }}>
                    <Input name='title' value={form.title} onChange={handleChange} mb={3} />
                    <Textarea name='description' value={form.description} onChange={handleChange} mb={3} />
                    <Input type='date' name='dueDate' value={form.dueDate} onChange={handleChange} mb={3} />
                    <Select name='priority' value={form.priority} onChange={handleChange} mb={3}>
                        <option>Most Important</option>
                        <option>Important</option>
                        <option>Least Important</option>
                    </Select>
                    <Select name='status' value={form.status} onChange={handleChange} mb={3}>
                        <option>To-Do</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                    </Select>
                    <div>
                        <Button colorScheme='green' mr={2} onClick={handleSave}>Save</Button>
                        <Button onClick={() => setEditing(false)}>Cancel</Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TaskDetails;
