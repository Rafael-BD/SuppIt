import React from 'react';

interface Donate {
    name: string;
    email: string;
    amount: string;
}

interface RecentDonatesProps {
    donates?: Donate[];
}

const defaultDonates: Donate[] = [
    {
        name: 'Olivia Martin',
        email: 'olivia.martin@email.com',
        amount: '+$1,999.00',
    },
    {
        name: 'Jackson Lee',
        email: 'jackson.lee@email.com',
        amount: '+$39.00',
    },
    {
        name: 'Isabella Nguyen',
        email: 'isabella.nguyen@email.com',
        amount: '+$299.00',
    },
    {
        name: 'William Kim',
        email: 'will@email.com',
        amount: '+$99.00',
    },
    {
        name: 'Sofia Davis',
        email: 'sofia.davis@email.com',
        amount: '+$39.00',
    },
];

export function RecentDonates({ donates = defaultDonates }: RecentDonatesProps) {
    return (
        <div className="space-y-8">
            {donates.map((donate, index) => (
                <div key={index} className="flex items-center">
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{donate.name}</p>
                        <p className="text-sm text-muted-foreground">{donate.email}</p>
                    </div>
                    <div className="ml-auto font-medium">{donate.amount}</div>
                </div>
            ))}
        </div>
    );
}
