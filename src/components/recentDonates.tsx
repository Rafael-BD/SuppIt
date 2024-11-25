import React, { useEffect, useState } from 'react';

export interface Donate {
    id: number;
    created_at: string;
    amount: number;
    donor_email: string;
    donor_name: string;
    comment: string;
    creator_user: string;
    session_id: string;
    status: string;
}

interface RecentDonatesProps {
    donates?: Donate[];
}

export function RecentDonates({ donates }: RecentDonatesProps) {
    const [recentDonates, setRecentDonates] = useState<Donate[]>([]);

    useEffect(() => {
        if (donates) {
            setRecentDonates(donates);
        }
    }, [donates]);

    return (
        <div className="space-y-8">
            {recentDonates.map((donate) => (
                <div key={donate.id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{donate.donor_name}</p>
                        <p className="text-sm text-muted-foreground">{donate.donor_email}</p>
                    </div>
                    <div className="ml-auto font-medium">
                        {`+R$ ${(donate.amount / 100).toFixed(2)}`}
                    </div>
                </div>
            ))}
        </div>
    );
}
