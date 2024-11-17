'use client';
import { fetchBalance, fetchBalanceTransactions } from '@/src/api/backend';
import EarningsChart from '@/src/components/earnings-chart';
import HomeButton from '@/src/components/home-btn';
import LoginButton from '@/src/components/login-btn';
import ThemeToggleButton from '@/src/components/ThemeToggle-btn';
import TopBar from '@/src/components/topBar';
import React, { useEffect, useState } from 'react';
import { DatePicker } from '@/src/components/datePicker';

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
                <div className="flex items-center space-x-6">
                    <LoginButton />
                    <ThemeToggleButton />
                </div>
            </TopBar>
            <div className="h-52" />
            <EarningsChart size={2} data={transactions} />
        </div>
    );
};

export default DashboardPage;