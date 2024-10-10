import { FC, useState } from 'react';
import { TableData } from '../types/api';
import { Button, Modal, Popover, Space } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser } from '../services/user.service';

type Props = {
    record: TableData;
    onEdit: () => void;
};

const { confirm } = Modal;

const TableAction: FC<Props> = ({ record, onEdit }) => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const { mutate: deleteUserMutation } = useMutation({
        mutationFn: (id: string) => deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['USER_LIST'],
            });
            setOpen(false);
        },
    });

    const deleteRow = () => {
        confirm({
            title: 'Are you sure you want to delete this row?',
            destroyOnClose: true,
            centered: true,
            okType: 'danger',
            content: 'This action cannot be undone',
            onOk() {
                deleteUserMutation(record.id);
            },
        });
    };

    const content = (
        <Space>
            <Button
                onClick={() => {
                    setOpen(false);
                    onEdit();
                }}
            >
                Edit
            </Button>
            <Button onClick={deleteRow} type="primary">
                Delete
            </Button>
        </Space>
    );

    return (
        <Space>
            <Popover
                content={content}
                trigger="click"
                open={open}
                onOpenChange={setOpen}
            >
                <Button type="text" onClick={() => setOpen(true)}>
                    Menu
                </Button>
            </Popover>
        </Space>
    );
};

export default TableAction;
