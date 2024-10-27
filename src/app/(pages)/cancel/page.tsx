'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const CancelPage = () => {
    const searchParams = useSearchParams();
    const creator_user = searchParams.get('creator_user');

    useEffect(() => {
        if (creator_user) {
            // redirect to the creator's page 
            window.location.href = `creator/${creator_user}`;
        }
    }, [creator_user]);

    return null;
};

export default CancelPage;