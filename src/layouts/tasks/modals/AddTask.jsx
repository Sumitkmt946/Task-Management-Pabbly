import React, { useState, useEffect } from 'react';
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
    Tag,
    Select,
} from '@chakra-ui/react';
import { useToast, Spinner } from '@chakra-ui/react';
import apiService from '../../../services/api';

function AddTaskModal({ isOpen, onClose, onAdded }) {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Most Important',
        status: 'To-Do'
    });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleTagClick = (priority) => {
        setFormData({ ...formData, priority });
    };

    useEffect(() => {
        // No external data required for Add Task modal after removing Assign To and Project
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await apiService.createTask(formData);
            setFormData({
                title: '',
                description: '',
                dueDate: '',
                priority: 'Most Important',
                status: 'To-Do'
            });
            let Message = response.message
            toast({
                title: Message,
                status: 'success',
                position: 'top',
                duration: 5000,
                isClosable: true,
            });
            setLoading(false);
            onClose();
            if (typeof onAdded === 'function') onAdded();
        } catch (error) {
            let Error = error?.response?.data?.message || error.message || 'Failed to create task'
            toast({
                title: Error,
                status: 'error',
                position: 'top',
                duration: 5000,
                isClosable: true,
            });
            setLoading(false);
        }
    };
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" closeOnOverlayClick={false} isCentered>
            <ModalOverlay />
            <ModalContent >
                <form onSubmit={handleSubmit}>
                    <ModalHeader>Add Task</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input mt={3} mb={3} placeholder='Title' type='text' required name='title' value={formData.title} onChange={handleChange} />
                        <Textarea rows={7} mt={3} mb={3} placeholder='Description' type='text' required name='description' value={formData.description} onChange={handleChange} />
                        <Input mt={3} mb={3} placeholder='Due Date' type='date' required name='dueDate' value={formData.dueDate} onChange={handleChange} />

                        <Select mt={3} mb={3} name='status' value={formData.status} onChange={handleChange}>
                            <option value='To-Do'>To-Do</option>
                            <option value='In Progress'>In Progress</option>
                            <option value='Completed'>Completed</option>
                        </Select>

                        <div className='priority-container'>
                            <p>Priority: </p>
                            <Tag
                                size='lg'
                                cursor={'pointer'}
                                colorScheme={formData.priority === 'Most Important' ? 'red' : 'gray'}
                                borderRadius='full'
                                onClick={() => handleTagClick('Most Important')}
                            >
                                <p className='tag-text'>Most Important</p>
                            </Tag>
                            <Tag
                                size='lg'
                                cursor={'pointer'}
                                colorScheme={formData.priority === 'Important' ? 'yellow' : 'gray'}
                                borderRadius='full'
                                onClick={() => handleTagClick('Important')}
                            >
                                <p className='tag-text'>Important</p>
                            </Tag>
                            <Tag
                                size='lg'
                                cursor={'pointer'}
                                colorScheme={formData.priority === 'Least Important' ? 'green' : 'gray'}
                                borderRadius='full'
                                onClick={() => handleTagClick('Least Important')}
                            >
                                <p className='tag-text'>Least Important</p>
                            </Tag>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant='solid' color="white" bg='darkcyan' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant='outline' type='submit'>{loading ? <Spinner color='green' /> : 'Add Task'}</Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}

export default AddTaskModal;
