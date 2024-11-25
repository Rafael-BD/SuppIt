'use client';
import { Button } from '@/src/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import React, { useEffect, useState } from 'react';
import { fetchAccountData } from '../api/backend';

const LoginButton: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const response = await fetchAccountData();
            setIsLoggedIn(response?.status === 200);
        };
        
        checkLoginStatus();
    }, []);

    if (!isLoggedIn) {
        return (
            <Button variant="outline" onClick={() => window.location.href = '/login'}>
                Login
            </Button>
        );
    }

    return (
        <Avatar className="cursor-pointer" onClick={() => window.location.href = '/profile'}>
            <AvatarImage src="/default-avatar.png" alt="Profile" />
            <AvatarFallback>U</AvatarFallback>
        </Avatar>
    );
};

export default LoginButton;