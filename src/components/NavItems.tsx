import {
    CalendarFilled,
    HomeFilled,
    QuestionCircleFilled,
} from '@ant-design/icons';
import { Flex, Space } from 'antd';
import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

type Props = {
    collapsed: boolean;
};

const navItems = [
    {
        label: 'Home',
        icon: <HomeFilled />,
        path: '/',
    },
    {
        label: 'Calendar',
        icon: <CalendarFilled />,
        path: '/calendar',
    },
    {
        label: 'Extra stuff',
        icon: <QuestionCircleFilled />,
        path: '/extra',
    },
];

const NavItems: FC<Props> = ({ collapsed }) => {
    const router = useLocation();
    return (
        <Flex vertical className="mx-3" gap={10} align="center">
            {navItems.map((item) => (
                <Link
                    to={item.path}
                    key={item.path}
                    className={`w-full text-white flex justify-center items-center py-5 rounded-lg transition-all duration-300  ${
                        router.pathname === item.path
                            ? 'bg-blue-700 hover:text-white hover:bg-rose-500'
                            : 'hover:bg-blue-600 hover:text-white'
                    }`}
                >
                    {item.icon}
                    <span
                        className={` transition-all duration-300 ${
                            !collapsed
                                ? 'opacity-100 ml-4'
                                : 'opacity-0 w-0 ml-0'
                        } ${
                            router.pathname === item.path
                                ? 'text-white font-bold'
                                : 'text-white/50'
                        }`}
                    >
                        {item.label}
                    </span>
                </Link>
            ))}
        </Flex>
    );
};

export default NavItems;
