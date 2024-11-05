'use client';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { w } from 'windstitch';
import Link from 'next/link';
import TopBar from '@/src/components/topBar';
import HomeButton from '@/src/components/home-btn';
import ThemeToggleButton from '@/src/components/ThemeToggle-btn';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { saveStripeId } from '@/src/api/backend';

const Container = w('div', {
    className: 'flex flex-col items-center justify-center min-h-screen p-4',
});

const ReturnPage = () => {
    const searchParams = useSearchParams();
    const stripeId = searchParams.get('id');

    useEffect(() => {
        const saveId = async () => {
            if (stripeId) {
                const response = await saveStripeId({ stripe_id: stripeId });
                if (response.status === 200) {
                    console.log(response.data);
                } else {
                    console.error('Failed to save Stripe ID');
                }
            }
        };
        saveId();
    }, [stripeId]);
    
    return (
        <Container>
            <TopBar>
                <HomeButton />
                <div className="flex items-center space-x-6">
                    <ThemeToggleButton />
                </div>
            </TopBar>
            <Card className="max-w-md w-full bg-[hsl(var(--primary-foreground))]">
                <CardHeader>
                    <CardTitle>Stripe Account Registered</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-lg">Your Stripe account has been successfully registered. You are now able to receive payments.</p>
                    <Link href="/profile/payments">
                        <Button variant="outline" className="w-full mt-4">
                            Return to Payments
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </Container>
    );
};

export default ReturnPage;