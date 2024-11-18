'use client';
import { fetchBalance, fetchBalanceTransactions } from '@/src/api/backend';
import HomeButton from '@/src/components/home-btn';
import LoginButton from '@/src/components/login-btn';
import ThemeToggleButton from '@/src/components/ThemeToggle-btn';
import TopBar from '@/src/components/topBar';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { DateRangePicker } from "@/src/components/dateRange-picker";
import EarningChart from "@/src/components/earnings-chart";
import { RecentDonates } from "@/src/components/recentDonates";
import { Button } from '@/src/components/ui/button';
import { w } from 'windstitch';

const Container = w('div', {
    className: 'flex items-center space-x-6'
});

const Spacer = w('div', {
    className: 'mt-10'
});

const HiddenFlexCol = w('div', {
    className: 'hidden flex-col space-y-6 p-10 pb-16 md:block'
});

const BorderBottom = w('div', {
    className: 'border-b'
});

const FlexItemsCenter = w('div', {
    className: 'flex h-16 items-center px-4'
});

const FlexItemsCenterSpace = w('div', {
    className: 'ml-auto flex items-center space-x-4'
});

const Flex1SpaceY = w('div', {
    className: 'flex-1 space-y-4 py-8 pt-6'
});

const GridCols = w('div', {
    className: 'grid gap-4 md:grid-cols-2 lg:grid-cols-4'
});

const GridColsLarge = w('div', {
    className: 'grid gap-2 md:grid-cols-2 lg:grid-cols-7'
});

const GridColsSmall = w('div', {
    className: 'grid gap-4 md:grid-cols-2 lg:grid-cols-3'
});

const ColSpan4 = w(Card, {
    className: 'col-span-4'
});

const ColSpan3 = w(Card, {
    className: 'col-span-3'
});

const HeaderCard = w(CardHeader, {
    className: 'flex flex-row items-center justify-between space-y-0 pb-2'
});

const TitleCard = w(CardTitle, {
    className: 'text-sm font-medium'
});

const CardValue = w('div', {
    className: 'text-2xl font-bold'
});

const DescriptionCard = w(CardDescription, {
    className: 'text-xs text-muted-foreground'
});

const PageTitle = w('h1', {
    className: 'text-2xl font-bold tracking-tight'
});

const processTransactions = (transactions: any[]) => {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const earningsByYear = transactions.reduce((acc, transaction) => {
        if (transaction.reporting_category === "charge") {
            const date = new Date(transaction.available_on * 1000);
            const year = date.getFullYear();
            const month = date.getMonth();
            const amountInReais = transaction.amount / 100;

            if (!acc[year]) {
                acc[year] = {};
            }
            if (!acc[year][month]) {
                acc[year][month] = 0;
            }
            acc[year][month] += amountInReais;
        }
        return acc;
    }, {});

    return Object.keys(earningsByYear).map(year => ({
        year: parseInt(year),
        months: Object.keys(earningsByYear[year]).map(month => ({
            month: months[parseInt(month)],
            earnings: earningsByYear[year][month]
        }))
    }));
};

const DashboardPage = () => {
    const [balance, setBalance] = useState({});
    const [transactions, setTransactions] = useState<{ year: number; months: { month: string; earnings: number; }[] }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBalanceData = async () => {
            const data = await fetchBalance();
            setBalance(data);
        };
        const fetchTransactionsData = async () => {
            const data = await fetchBalanceTransactions();
            const processedTransactions = processTransactions(data);
            setTransactions(processedTransactions);
        };

        Promise.all([fetchBalanceData(), fetchTransactionsData()]);
        setLoading(false);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <TopBar>
                <HomeButton />
                <Container>
                    <LoginButton />
                    <ThemeToggleButton />
                </Container>
            </TopBar>
            <Spacer />
            <HiddenFlexCol>
                <BorderBottom>
                    <FlexItemsCenter>
                    <PageTitle>Dashboard</PageTitle>
                        <FlexItemsCenterSpace>
                            <DateRangePicker />
                            <Button>Download</Button>
                        </FlexItemsCenterSpace>
                    </FlexItemsCenter>
                </BorderBottom>
                <Flex1SpaceY>
                    <GridCols>
                        <Card>
                            <HeaderCard>
                                <TitleCard>Total Revenue</TitleCard>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                            </HeaderCard>
                            <CardContent>
                                <CardValue>$45,231.89</CardValue>
                                <DescriptionCard>+20.1% from last month</DescriptionCard>
                            </CardContent>
                        </Card>
                        <Card>
                            <HeaderCard>
                                <TitleCard>Subscriptions</TitleCard>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </HeaderCard>
                            <CardContent>
                                <CardValue>+2350</CardValue>
                                <DescriptionCard>+180.1% from last month</DescriptionCard>
                            </CardContent>
                        </Card>
                        <Card>
                            <HeaderCard>
                                <TitleCard>Donations</TitleCard>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
                                    <rect width="20" height="14" x="2" y="5" rx="2" />
                                    <path d="M2 10h20" />
                                </svg>
                            </HeaderCard>
                            <CardContent>
                                <CardValue>+12,234</CardValue>
                                <DescriptionCard>+19% from last month</DescriptionCard>
                            </CardContent>
                        </Card>
                        <Card>
                            <HeaderCard>
                                <TitleCard>Active Now</TitleCard>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                </svg>
                            </HeaderCard>
                            <CardContent>
                                <CardValue>+573</CardValue>
                                <DescriptionCard>+201 since last hour</DescriptionCard>
                            </CardContent>
                        </Card>
                    </GridCols>
                    <GridColsLarge>
                        <ColSpan4>
                            <CardHeader>
                                <CardTitle>Earnings</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <EarningChart size={2} data={transactions} />
                            </CardContent>
                        </ColSpan4>
                        <ColSpan3>
                            <CardHeader>
                                <CardTitle>Recent Donations</CardTitle>
                                <CardDescription>You received 265 donations this month.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RecentDonates />
                            </CardContent>
                        </ColSpan3>
                    </GridColsLarge>
                </Flex1SpaceY>
            </HiddenFlexCol>
        </div>
    );
};

export default DashboardPage;