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

    useEffect(() => {
        const sendDonation = async () => {
            try {
                const response = await fetch('http://localhost:8000/donate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        creator_user: accountUser,
                        amount: Number(amount),
                        donorName,
                        donorEmail,
                        sessionId,
                        comment,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to send donation');
                }

                const text = await response.text();
                const data = text ? JSON.parse(text) : {};
            } catch (error) {
                console.error('Error:', error);
            }
        };

        if (accountUser && amount && donorName && donorEmail) {
            sendDonation();
        }
    }, [accountUser, amount, donorName, donorEmail]);

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
                </CardContent>
            </StyledCard>
        </Container>
    );
};

export default SuccessPage;