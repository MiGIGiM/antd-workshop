import { FC } from 'react';
import { TableData } from '../../types/api';
import Form, { FormProps } from 'antd/es/form';
import { Button, Checkbox, Divider, Flex, Input, InputNumber } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '../../services/user.service';

type Props = {
    record?: TableData;
    onEdit: () => void;
};

type FieldType = Partial<TableData>;

const currencyFormater = (value: any) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);
};

const currencyParser = (value: any) => {
    const locale = 'en-US';

    try {
        if (typeof value === 'string' && !value.length) {
            value = '0.0';
        }

        const group = new Intl.NumberFormat(locale)
            .format(1111)
            .replace(/1/g, '');

        const decimal = new Intl.NumberFormat(locale)
            .format(1.1)
            .replace(/1/g, '');

        let reversedVal = value.replace(new RegExp('\\' + group, 'g'), '');

        reversedVal = reversedVal.replace(new RegExp('\\' + decimal, 'g'), '.'); // => 1234.21 $

        reversedVal = reversedVal.replace(/[^0-9.]/g, ''); // => 1234.21

        const digitsAfterDecimalPoint = reversedVal.split('.')[1] || []; // => 21

        const needToAppendDigits = digitsAfterDecimalPoint > 2;

        if (needToAppendDigits) {
            reversedVal =
                reversedVal * Math.pow(10, digitsAfterDecimalPoint - 2);
        }

        return Number.isNaN(reversedVal) ? 0 : reversedVal;
    } catch (error) {
        console.error(error);
    }
};

const EditUser: FC<Props> = ({ record, onEdit }) => {
    const queryClient = useQueryClient();

    const { mutate: updateUserMutation, status: updateUserStatus } =
        useMutation({
            mutationFn: (data: FieldType) => updateUser(data),
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['USER_LIST'],
                });
                onEdit();
            },
        });

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        updateUserMutation({
            ...record,
            ...values,
        });
    };

    return (
        <Form
            onFinish={onFinish}
            initialValues={record}
            autoComplete="off"
            className="h-full relative"
            layout="vertical"
        >
            <Form.Item<FieldType>
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input your name!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item<FieldType>
                label="Email"
                name="email"
                rules={[
                    { required: true, message: 'Please input your email!' },
                    {
                        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email',
                    },
                ]}
            >
                <Input type="email" />
            </Form.Item>
            <Form.Item<FieldType>
                label="Salary"
                name="salary"
                rules={[
                    { required: true, message: 'Please input your salary!' },
                    {
                        pattern: /^[0-9]+$/,
                        message: 'Please input a valid salary!',
                    },
                ]}
            >
                <InputNumber
                    className="w-full"
                    parser={currencyParser}
                    formatter={currencyFormater}
                />
            </Form.Item>
            <Form.Item<FieldType> label="Phone Number" name="telephone">
                <Input />
            </Form.Item>
            <Divider>Address</Divider>
            <Form.Item<FieldType>
                label="Street"
                name={['address', 'street']} // address.street
            >
                <Input />
            </Form.Item>
            <Flex gap={10}>
                <Form.Item<FieldType>
                    label="Town"
                    name={['address', 'town']} // address.town
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Postal Code"
                    name={['address', 'postode']} // address.postode
                >
                    <Input />
                </Form.Item>
            </Flex>
            <Form.Item<FieldType> name="verified" valuePropName="checked">
                <Checkbox>Verified</Checkbox>
            </Form.Item>
            <Form.Item<FieldType>
                label="Description"
                name="description"
                rules={[
                    {
                        required: true,
                        message: 'Please input your description!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Button
                type="primary"
                htmlType="submit"
                block
                className="w-full absolute bottom-0"
                loading={updateUserStatus === 'pending'}
                disabled={updateUserStatus === 'pending'}
            >
                Submit
            </Button>
        </Form>
    );
};

export default EditUser;
