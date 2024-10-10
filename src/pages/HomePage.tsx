import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Button,
    Drawer,
    Flex,
    Table,
    TableColumnType,
    TableProps,
    Tag,
} from 'antd';
import { deleteUsersInBulk, getUsers } from '../services/user.service';
import { Address, TableData } from '../types/api';
import TableAction from '../components/TableAction';
import React, { useState } from 'react';
import EditUser from '../components/Form/EditUser';

const HomePage = () => {
    const queryClient = useQueryClient();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [checkedRowKeys, setCheckedRowKeys] = useState<React.Key[]>([]);
    const [editableRecord, setEditableRecord] = useState<TableData | undefined>(
        undefined,
    );
    const { data: users, isLoading } = useQuery({
        queryKey: ['USER_LIST'],
        queryFn: getUsers,
    });
    const { mutateAsync: deleteUsers, status } = useMutation({
        mutationFn: (ids: string[]) => deleteUsersInBulk(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['USER_LIST'],
            });
            setCheckedRowKeys([]);
        },
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
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
                `${new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(salary)}`,
            sorter: (a: TableData, b: TableData) => a.salary - b.salary,
        },
        {
            title: 'Verified',
            dataIndex: 'verified',
            key: 'verified',
            render: (verified: boolean) => (
                <Tag color={verified ? 'green' : 'red'}>
                    {verified ? 'Yes' : 'No'}
                </Tag>
            ),
            filters: [
                {
                    text: 'Yes',
                    value: true,
                },
                {
                    text: 'No',
                    value: false,
                },
                {
                    text: 'N/A',
                    value: 'N/A',
                },
            ],
            onFilter: (value: boolean, { verified }: TableData) =>
                verified === value,
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (_: any, record: TableData) => (
                <TableAction
                    record={record}
                    onEdit={() => {
                        setIsEditOpen(true);
                        setEditableRecord(record);
                    }}
                />
            ),
        },
    ];

    const rowSelection: TableProps<TableData>['rowSelection'] = {
        onChange: (seletedRowKeys: React.Key[]) => {
            setCheckedRowKeys(seletedRowKeys);
        },
    };

    return (
        <section className="space-y-5 py-4">
            <Flex className="px-3" justify="flex-end">
                <Button
                    color="danger"
                    variant="solid"
                    disabled={!checkedRowKeys.length}
                    onClick={async () => {
                        await deleteUsers(checkedRowKeys as string[]);
                    }}
                    loading={status === 'pending'}
                >
                    Delete ({checkedRowKeys.length})
                </Button>
            </Flex>
            <Table
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                }}
                dataSource={users}
                columns={columns}
                loading={isLoading}
            />
            <Drawer
                title="Edit User"
                onClose={() => {
                    setIsEditOpen(false);
                    setEditableRecord(undefined);
                }}
                open={isEditOpen}
                destroyOnClose
                closable
            >
                <EditUser
                    record={editableRecord}
                    onEdit={() => {
                        setIsEditOpen(false);
                        setEditableRecord(undefined);
                    }}
                />
            </Drawer>
        </section>
    );
};

export default HomePage;
