'use client';
import { Button } from '@/src/components/ui/button';
import React from 'react';

const LoginButton: React.FC = () => {
    return (
        <Button variant="outline" onClick={() => window.location.href = '/login'}>
            Login
        </Button>
    );
};

export default LoginButton;