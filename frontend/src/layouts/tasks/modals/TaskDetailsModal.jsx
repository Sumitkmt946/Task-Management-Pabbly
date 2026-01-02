import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
    Textarea,
    Select,
    useToast,
} from '@chakra-ui/react';
import axios from 'axios';

function TaskDetailsModal({ isOpen, onClose, taskId, onUpdated }) {
    const toast = useToast();
    const [task, setTask] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', dueDate: '', priority: 'Most Important', status: 'To-Do' });

    const token = localStorage.getItem('tm_token');
    const axiosInstance = axios.create({ headers: { Authorization: `Bearer ${token}` } });

    useEffect(() => {
        if (isOpen && taskId) fetchTask();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, taskId]);

    const fetchTask = async () => {
        try {
            const res = await axiosInstance.get(`/api/task/${taskId}`);
            setTask(res.data);
            setForm({
                title: res.data.title || '',
                description: res.data.description || '',
                dueDate: res.data.dueDate ? new Date(res.data.dueDate).toISOString().split('T')[0] : '',
                priority: res.data.priority || 'Most Important',
                status: res.data.status || 'To-Do'
            });
        } catch (err) {
            console.error(err);
            toast({ title: 'Failed to load task', status: 'error' });
        }
    };

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSave = async () => {
        try {
            await axiosInstance.put(`/api/task/${taskId}`, form);
            toast({ title: 'Task updated', status: 'success' });
            setEditing(false);
            if (typeof onUpdated === 'function') onUpdated();
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
            await axiosInstance.delete(`/api/task/${taskId}`);
            toast({ title: 'Task deleted', status: 'success' });
            if (typeof onUpdated === 'function') onUpdated();
            onClose();
        } catch (err) {
            console.error(err);
            toast({ title: 'Delete failed', status: 'error' });
        }
    };

    const updateStatus = async (newStatus) => {
        try {
            await axiosInstance.put(`/api/task/${taskId}`, { status: newStatus });
            toast({ title: 'Status updated', status: 'success' });
            if (typeof onUpdated === 'function') onUpdated();
            fetchTask();
        } catch (err) {
            console.error(err);
            toast({ title: 'Status update failed', status: 'error' });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Task Details</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {!task ? (
                        <div>Loading...</div>
                    ) : (
                        <>
                            {!editing ? (
                                <>
                                    <h3 style={{ marginBottom: 8 }}>{task.title}</h3>
                                    <p><strong>Description:</strong></p>
                                    <p>{task.description}</p>
                                    <p><strong>Due Date:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
                                    <p><strong>Priority:</strong> {task.priority}</p>
                                    <p><strong>Status:</strong> {task.status}</p>
                                </>
                            ) : (
                                <div>
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
                                </div>
                            )}
                        </>
                    )}
                </ModalBody>

                <ModalFooter>
                    {!editing ? (
                        <>
                            <Button colorScheme='blue' mr={2} onClick={() => setEditing(true)}>Edit</Button>
                            <Button colorScheme='green' mr={2} onClick={() => updateStatus('In Progress')}>Mark In Progress</Button>
                            <Button colorScheme='teal' mr={2} onClick={() => updateStatus('To-Do')}>Mark To-Do</Button>
                            <Button colorScheme='purple' mr={2} onClick={() => updateStatus('Completed')}>Mark Completed</Button>
                            <Button colorScheme='red' onClick={handleDelete}>Delete</Button>
                        </>
                    ) : (
                        <>
                            <Button colorScheme='green' mr={2} onClick={handleSave}>Save</Button>
                            <Button onClick={() => setEditing(false)}>Cancel</Button>
                        </>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default TaskDetailsModal;
