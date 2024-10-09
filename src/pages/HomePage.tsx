import { useQuery } from '@tanstack/react-query';
import { Table, TableColumnType } from 'antd';
import { getUsers } from '../services/user.service';
import { Address, TableData } from '../types/api';

const HomePage = () => {
    const { data: users, isLoading } = useQuery({
        queryKey: ['USER_LIST'],
        queryFn: getUsers,
    });

    const columns: TableColumnType<TableData> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Date of Birth',
            dataIndex: 'dob',
            key: 'dob',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            render: (address: Address) =>
                `${address.street} ${address.town} ${address.postode}`,
        },
        {
            title: 'Salary',
            dataIndex: 'salary',
            key: 'salary',
            render: (salary: number) =>
                `${new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(salary)}`,
            sorter: (a: TableData, b: TableData) => a.salary - b.salary,
        },
    ];

    return <Table dataSource={users} columns={columns} loading={isLoading} />;
};

export default HomePage;
