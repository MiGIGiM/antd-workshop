import axios from 'axios';
import { TableData } from '../types/api';

const api = axios.create({
    baseURL: 'http://localhost:3000',
});

api.interceptors.request.use(
    async (config) => {
        const delayMs = Math.floor(Math.random() * 1000);

        await new Promise((resolve) => setTimeout(resolve, delayMs));
        return config;
    },
    async (error) => Promise.reject(error),
);

export const getUsers = async () => {
    const { data } = await api.get<TableData[]>('/users');
    return data.map((user) => ({ ...user, key: user.id }));
};

export const deleteUser = async (id: string) => {
    await api.delete(`/users/${id}`);
};

export const updateUser = async (user: TableData) => {
    await api.put(`/users/${user.id}`, {
        ...user,
        key: undefined,
    });
};

export const deleteUsersInBulk = async (ids: string[]) => {
    return Promise.all(ids.map((id) => deleteUser(id)));
};

export const getUsersDoB = async () => {
    const { data } = await api.get<TableData[]>('/users');
    return data.map((user) => ({
        id: user.id,
        name: user.name,
        dob: user.dob,
    }));
};
