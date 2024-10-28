'use client';
import { w } from 'windstitch';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useEffect } from 'react';

const Container = w('div', {
    className: 'flex items-center justify-center min-h-screen bg-gray-100',
});

const StyledCard = w(Card, {
    className: 'max-w-md w-full',
});

const SuccessPage = () => {
    const searchParams = useSearchParams();
    const accountUser = searchParams.get('creator_user');
    const amount = searchParams.get('amount');
    const status = searchParams.get('status');
    const donorName = searchParams.get('donorName');
    const donorEmail = searchParams.get('donorEmail');
    const sessionId = searchParams.get('sessionId');
    const comment = searchParams.get('comment');

    if (status !== 'success') {
        return <div>Invalid status</div>;
    }

    const amountInReais = (Number(amount) / 100).toFixed(2);

    return (
        <Container>
            <StyledCard>
                <CardHeader>
                    <CardTitle>Donation Successful</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Thank you for your donation!</p>
                    <p>Creator User: {accountUser}</p>
                    <p>Amount: R$ {amountInReais}</p>
                    <p>Donor Name: {donorName}</p>
                    <p>Donor Email: {donorEmail}</p>
                    <p>Session ID: {sessionId}</p>
                    <p>Comment: {comment}</p>
                </CardContent>
            </StyledCard>
        </Container>
    );
};

export default SuccessPage;