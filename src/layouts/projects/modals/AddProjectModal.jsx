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
    Select,
    FormControl,
    FormLabel,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Box,
} from '@chakra-ui/react';
import { useToast, Spinner } from '@chakra-ui/react';
import apiService from '../../../services/api';

function AddProjectModal({ isOpen, onClose, onAdded, editData }) {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'Pending',
        priority: 'Medium',
        deadline: '',
        progress: 0,
        tasksCount: 0
    });

    useEffect(() => {
        if (editData) {
            setFormData({
                name: editData.name || '',
                description: editData.description || '',
                status: editData.status || 'Pending',
                priority: editData.priority || 'Medium',
                deadline: editData.deadline ? new Date(editData.deadline).toISOString().split('T')[0] : '',
                progress: editData.progress || 0,
                tasksCount: editData.tasksCount || 0
            });
        } else {
            setFormData({
                name: '',
                description: '',
                status: 'Pending',
                priority: 'Medium',
                deadline: '',
                progress: 0,
                tasksCount: 0
            });
        }
    }, [editData, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProgressChange = (value) => {
        setFormData({ ...formData, progress: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editData) {
                await apiService.updateProject(editData._id, formData);
                toast({
                    title: 'Project updated!',
                    status: 'success',
                    position: 'top',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                await apiService.createProject(formData);
                toast({
                    title: 'Project created!',
                    status: 'success',
                    position: 'top',
                    duration: 3000,
                    isClosable: true,
                });
            }
            setFormData({
                name: '',
                description: '',
                status: 'Pending',
                priority: 'Medium',
                deadline: '',
                progress: 0,
                tasksCount: 0
            });
            setLoading(false);
            onClose();
            if (typeof onAdded === 'function') onAdded();
        } catch (error) {
            toast({
                title: error?.message || 'Operation failed',
                status: 'error',
                position: 'top',
                duration: 5000,
                isClosable: true,
            });
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg" closeOnOverlayClick={false} isCentered>
            <ModalOverlay />
            <ModalContent>
                <form onSubmit={handleSubmit}>
                    <ModalHeader>{editData ? 'Edit Project' : 'Create New Project'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl mb={4} isRequired>
                            <FormLabel>Project Name</FormLabel>
                            <Input
                                placeholder='Enter project name'
                                name='name'
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </FormControl>

                        <FormControl mb={4} isRequired>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                                placeholder='Enter project description'
                                name='description'
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                            />
                        </FormControl>

                        <FormControl mb={4} isRequired>
                            <FormLabel>Status</FormLabel>
                            <Select name='status' value={formData.status} onChange={handleChange}>
                                <option value='Pending'>Pending</option>
                                <option value='In Progress'>In Progress</option>
                                <option value='Completed'>Completed</option>
                                <option value='On Hold'>On Hold</option>
                            </Select>
                        </FormControl>

                        <FormControl mb={4} isRequired>
                            <FormLabel>Priority</FormLabel>
                            <Select name='priority' value={formData.priority} onChange={handleChange}>
                                <option value='High'>High</option>
                                <option value='Medium'>Medium</option>
                                <option value='Low'>Low</option>
                            </Select>
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Deadline</FormLabel>
                            <Input
                                type='date'
                                name='deadline'
                                value={formData.deadline}
                                onChange={handleChange}
                            />
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Progress: {formData.progress}%</FormLabel>
                            <Box px={2}>
                                <Slider
                                    value={formData.progress}
                                    onChange={handleProgressChange}
                                    min={0}
                                    max={100}
                                    colorScheme='teal'
                                >
                                    <SliderTrack>
                                        <SliderFilledTrack />
                                    </SliderTrack>
                                    <SliderThumb boxSize={6} />
                                </Slider>
                            </Box>
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Number of Tasks</FormLabel>
                            <Input
                                type='number'
                                placeholder='Tasks count'
                                name='tasksCount'
                                value={formData.tasksCount}
                                onChange={handleChange}
                                min={0}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant='solid' color="white" bg='gray.500' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='teal' type='submit'>
                            {loading ? <Spinner color='white' /> : (editData ? 'Update' : 'Create Project')}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}

export default AddProjectModal;
