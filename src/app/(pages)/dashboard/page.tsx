'use client';
import React, { useEffect, useState } from 'react';
import {
    fetchBalance,
    fetchBalanceTransactions,
    fetchRecentDonations,
} from '@/src/api/backend';
import HomeButton from '@/src/components/home-btn';
import LoginButton from '@/src/components/login-btn';
import ThemeToggleButton from '@/src/components/ThemeToggle-btn';
import TopBar from '@/src/components/topBar';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/src/components/ui/card';
import { DateRangePicker } from '@/src/components/dateRange-picker';
import EarningChart from '@/src/components/earnings-chart';
import { Donate, RecentDonates } from '@/src/components/recentDonates';
import { Button } from '@/src/components/ui/button';
import { w } from 'windstitch';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/src/components/ui/tabs';
import { Download } from 'lucide-react';

interface Transaction {
    available_on: number;
    amount: number;
}

interface EarningsByYear {
    year: number;
    months: {
        month: string;
        earnings: number;
    }[];
}

const Container = w('div', {
    className: 'flex items-center space-x-6',
});

const Spacer = w('div', { className: 'mt-10' });

const HiddenFlexCol = w('div', {
    className: 'flex flex-col space-y-6 p-4 md:p-10 pb-16 mt-16 md:mt-10',
});

const BorderBottom = w('div', { className: 'border-b pb-4' });

const FlexItemsCenter = w('div', {
    className: 'flex flex-col md:flex-row items-start md:items-center',
});

const FlexItemsCenterSpace = w('div', {
    className: 'flex items-center space-x-2 sm:space-x-4 mt-2 md:mt-0 md:ml-auto',
});

const Flex1SpaceY = w('div', {
    className: 'flex-1 space-y-4 py-8 pt-3',
});

const GridCols = w('div', {
    className: 'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
});

const GridColsLarge = w('div', {
    className: 'grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-7',
});

const ColSpan4 = w(Card, { className: 'col-span-1 lg:col-span-4' });

const ColSpan3 = w(Card, { className: 'col-span-1 lg:col-span-3' });

const HeaderCard = w(CardHeader, {
    className: 'flex flex-row items-center justify-between space-y-0 pb-2',
});

const TitleCard = w(CardTitle, { className: 'text-sm font-medium' });

const CardValue = w('div', { className: 'text-2xl font-bold' });

const DescriptionCard = w(CardDescription, {
    className: 'text-xs text-muted-foreground',
});

const PageTitle = w('h1', { className: 'text-2xl font-bold tracking-tight mb-6 md:mb-0' });

const processTransactions = (transactions: Transaction[]): EarningsByYear[] => {
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const earningsByYear: Record<number, Record<number, number>> = {};

    transactions.forEach((transaction) => {
        const date = new Date(transaction.available_on * 1000);
        const year = date.getFullYear();
        const month = date.getMonth();
        const amountInReais = transaction.amount / 100;

        if (!earningsByYear[year]) {
            earningsByYear[year] = {};
        }
        if (!earningsByYear[year][month]) {
            earningsByYear[year][month] = 0;
        }
        earningsByYear[year][month] += amountInReais;
    });

    return Object.keys(earningsByYear).map((year) => ({
        year: parseInt(year),
        months: Object.keys(earningsByYear[parseInt(year)]).map((month) => ({
            month: months[parseInt(month)],
            earnings: earningsByYear[parseInt(year)][parseInt(month)],
        })),
    }));
};

const DashboardPage: React.FC = () => {
    const [balance, setBalance] = useState<any>({});
    const [transactions, setTransactions] = useState<EarningsByYear[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalDonations, setTotalDonations] = useState(0);
    const [revenuePercentChange, setRevenuePercentChange] = useState(0);
    const [donationsPercentChange, setDonationsPercentChange] = useState(0);
    const [recentDonates, setRecentDonates] = useState<Donate[]>([]);
    const [thisMonthDonationCount, setThisMonthDonationCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const [balanceData, transactionsData, donationsData] = await Promise.all([
                fetchBalance(),
                fetchBalanceTransactions(),
                fetchRecentDonations(),
            ]);

            setBalance(balanceData);

            const processedTransactions = processTransactions(transactionsData);
            setTransactions(processedTransactions);

            let totalRevenue = 0;
            let totalDonations = transactionsData.length;

            const earningsByMonthYear: Record<
                string,
                { earnings: number; donations: number }
            > = {};

            transactionsData.forEach((transaction: { available_on: number; amount: number; }) => {
                const date = new Date(transaction.available_on * 1000);
                const year = date.getFullYear();
                const month = date.getMonth();
                const amountInReais = transaction.amount / 100;

                totalRevenue += amountInReais;

                const key = `${year}-${month}`;
                if (!earningsByMonthYear[key]) {
                    earningsByMonthYear[key] = { earnings: 0, donations: 0 };
                }
                earningsByMonthYear[key].earnings += amountInReais;
                earningsByMonthYear[key].donations += 1;
            });

            setTotalRevenue(totalRevenue);
            setTotalDonations(totalDonations);

            const today = new Date();
            const currentYear = today.getFullYear();
            const currentMonth = today.getMonth();

            let prevYear = currentYear;
            let prevMonth = currentMonth - 1;
            if (prevMonth < 0) {
                prevMonth = 11;
                prevYear = currentYear - 1;
            }

            const currentMonthKey = `${currentYear}-${currentMonth}`;
            const prevMonthKey = `${prevYear}-${prevMonth}`;

            const currentMonthData = earningsByMonthYear[currentMonthKey] || {
                earnings: 0,
                donations: 0,
            };
            const prevMonthData = earningsByMonthYear[prevMonthKey] || {
                earnings: 0,
                donations: 0,
            };

            const revenuePercentChange = prevMonthData.earnings
                ? ((currentMonthData.earnings - prevMonthData.earnings) /
                        prevMonthData.earnings) *
                    100
                : 0;
            const donationsPercentChange = prevMonthData.donations
                ? ((currentMonthData.donations - prevMonthData.donations) /
                        prevMonthData.donations) *
                    100
                : 0;

            setRevenuePercentChange(revenuePercentChange);
            setDonationsPercentChange(donationsPercentChange);

            if (donationsData) {
                setRecentDonates(donationsData);

                const thisMonthDonations = donationsData.filter((donation: Donate) => {
                    const donationDate = new Date(donation.created_at);
                    return (
                        donationDate.getMonth() === currentMonth &&
                        donationDate.getFullYear() === currentYear
                    );
                });

                setThisMonthDonationCount(thisMonthDonations.length);
            }

            setLoading(false);
        };

        fetchData();
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
                            <Button size={'sm'}>
                                <Download />
                            </Button>
                        </FlexItemsCenterSpace>
                    </FlexItemsCenter>
                </BorderBottom>
                <Flex1SpaceY>
                    <Tabs defaultValue="overview" className="space-y-4">
                        <TabsList >
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="saldo">Saldo</TabsTrigger>
                            <TabsTrigger value="beneficios">Benefícios</TabsTrigger>
                            <TabsTrigger value="embbed">Embbed</TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview" className="space-y-4">
                            <GridCols>
                                <Card>
                                    <HeaderCard>
                                        <TitleCard>Total Revenue</TitleCard>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            className="h-4 w-4 text-muted-foreground"
                                        >
                                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                        </svg>
                                    </HeaderCard>
                                    <CardContent>
                                        <CardValue>{`R$${totalRevenue.toFixed(2)}`}</CardValue>
                                        <DescriptionCard>
                                            {`${revenuePercentChange >= 0 ? '+' : ''}${revenuePercentChange.toFixed(
                                                1
                                            )}% from last month`}
                                        </DescriptionCard>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <HeaderCard>
                                        <TitleCard>Subscriptions</TitleCard>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            className="h-4 w-4 text-muted-foreground"
                                        >
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
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            className="h-4 w-4 text-muted-foreground"
                                        >
                                            <rect width="20" height="14" x="2" y="5" rx="2" />
                                            <path d="M2 10h20" />
                                        </svg>
                                    </HeaderCard>
                                    <CardContent>
                                        <CardValue>{totalDonations}</CardValue>
                                        <DescriptionCard>
                                            {`${donationsPercentChange >= 0 ? '+' : ''}${donationsPercentChange.toFixed(
                                                1
                                            )}% from last month`}
                                        </DescriptionCard>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <HeaderCard>
                                        <TitleCard>Active Now</TitleCard>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            className="h-4 w-4 text-muted-foreground"
                                        >
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
                                        <CardDescription>{`You received ${thisMonthDonationCount} donations this month.`}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <RecentDonates donates={recentDonates} />
                                    </CardContent>
                                </ColSpan3>
                            </GridColsLarge>
                        </TabsContent>
                        <TabsContent value="saldo" className="space-y-4">
                            <div>Saldo Content</div>
                        </TabsContent>
                        <TabsContent value="beneficios" className="space-y-4">
                            <div>Benefícios Content</div>
                        </TabsContent>
                        <TabsContent value="embbed" className="space-y-4">
                            <div>Embbed Content</div>
                        </TabsContent>
                    </Tabs>
                </Flex1SpaceY>
            </HiddenFlexCol>
        </div>
    );
};

export default DashboardPage;

