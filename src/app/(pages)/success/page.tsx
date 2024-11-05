'use client';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { w } from 'windstitch';
import Link from 'next/link';
import TopBar from '@/src/components/topBar';
import HomeButton from '@/src/components/home-btn';
import LoginButton from '@/src/components/login-btn';
import ThemeToggleButton from '@/src/components/ThemeToggle-btn';

const Container = w('div', {
    className: 'flex flex-col items-center justify-center min-h-screen p-4',
});

const SuccessPage = () => {
    const searchParams = useSearchParams();
    const accountUser = searchParams.get('creator_user');
    const amount = searchParams.get('amount');
    const status = searchParams.get('status');
    const donorName = searchParams.get('donorName');
    const donorEmail = searchParams.get('donorEmail');
    const comment = searchParams.get('comment');

    if (status !== 'success') {
        return <div>Invalid status</div>;
    }

    const amountInReais = (Number(amount) / 100).toFixed(2);

    return (
        <Container>
            <TopBar>
                <HomeButton />
                <div className="flex items-center space-x-6">
                    <LoginButton />
                    <ThemeToggleButton />
                </div>
            </TopBar>
            <Card className="max-w-md w-full bg-[hsl(var(--primary-foreground))]">
                <CardHeader>
                    <CardTitle>Donation Successful</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-lg">Thank you for your donation!</p>
                    <div className="space-y-2">
                        <p><strong>Creator User:</strong> {accountUser}</p>
                        <p><strong>Amount:</strong> R$ {amountInReais}</p>
                        <p><strong>Donor Name:</strong> {donorName}</p>
                        <p><strong>Donor Email:</strong> {donorEmail}</p>
                        <p><strong>Comment:</strong> {comment}</p>
                    </div>
                    <Link href={`/creator/${accountUser}`}>
                        <Button variant="outline" className="w-full mt-4">
                            Return to Creator Page
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </Container>
    );
};

export default SuccessPage;