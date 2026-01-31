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
    Select,
    FormControl,
    FormLabel,
} from '@chakra-ui/react';
import { useToast, Spinner } from '@chakra-ui/react';
import apiService from '../../../services/api';

function AddTeamMemberModal({ isOpen, onClose, onAdded, editData }) {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'Developer',
        department: '',
        status: 'Active'
    });

    useEffect(() => {
        if (editData) {
            setFormData({
                name: editData.name || '',
                email: editData.email || '',
                phone: editData.phone || '',
                role: editData.role || 'Developer',
                department: editData.department || '',
                status: editData.status || 'Active'
            });
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                role: 'Developer',
                department: '',
                status: 'Active'
            });
        }
    }, [editData, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editData) {
                await apiService.updateTeamMember(editData._id, formData);
                toast({
                    title: 'Team member updated!',
                    status: 'success',
                    position: 'top',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                await apiService.createTeamMember(formData);
                toast({
                    title: 'Team member added!',
                    status: 'success',
                    position: 'top',
                    duration: 3000,
                    isClosable: true,
                });
            }
            setFormData({
                name: '',
                email: '',
                phone: '',
                role: 'Developer',
                department: '',
                status: 'Active'
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
                    <ModalHeader>{editData ? 'Edit Team Member' : 'Add Team Member'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl mb={4} isRequired>
                            <FormLabel>Full Name</FormLabel>
                            <Input
                                placeholder='Enter full name'
                                name='name'
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </FormControl>

                        <FormControl mb={4} isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type='email'
                                placeholder='Enter email address'
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </FormControl>

                        <FormControl mb={4} isRequired>
                            <FormLabel>Phone</FormLabel>
                            <Input
                                placeholder='Enter phone number'
                                name='phone'
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </FormControl>

                        <FormControl mb={4} isRequired>
                            <FormLabel>Role</FormLabel>
                            <Select name='role' value={formData.role} onChange={handleChange}>
                                <option value='Admin'>Admin</option>
                                <option value='Developer'>Developer</option>
                                <option value='Designer'>Designer</option>
                                <option value='Manager'>Manager</option>
                                <option value='Tester'>Tester</option>
                                <option value='HR'>HR</option>
                            </Select>
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Department</FormLabel>
                            <Input
                                placeholder='Enter department'
                                name='department'
                                value={formData.department}
                                onChange={handleChange}
                            />
                        </FormControl>

                        <FormControl mb={4} isRequired>
                            <FormLabel>Status</FormLabel>
                            <Select name='status' value={formData.status} onChange={handleChange}>
                                <option value='Active'>Active</option>
                                <option value='Inactive'>Inactive</option>
                            </Select>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant='solid' color="white" bg='gray.500' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='teal' type='submit'>
                            {loading ? <Spinner color='white' /> : (editData ? 'Update' : 'Add Member')}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}

export default AddTeamMemberModal;
