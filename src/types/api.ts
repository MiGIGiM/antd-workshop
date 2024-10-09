export type TableData = UserRow & { key: string };

type UserRow = {
    id: string;
    name: string;
    dob: Date;
    address: Address;
    telephone: string;
    pets: string[];
    score: number;
    email: string;
    url: string;
    description: string;
    verified: boolean;
    salary: number;
};

export type Address = {
    street: string;
    town: string;
    postode: string;
};
