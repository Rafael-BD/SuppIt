import { w } from 'windstitch';
import React from 'react';
const TopBarContainer = w('div', {
    className: 'w-full flex items-center justify-between py-4 px-10 fixed top-0 h-16 md:h-18 backdrop-filter backdrop-blur-lg bg-[hsl(var(--primary-foreground))]/50 z-50',
});

interface TopBarProps {
    children: React.ReactNode;
}

const TopBar: React.FC<TopBarProps> = ({ children }) => {
    return (
        <TopBarContainer>
            {children}
        </TopBarContainer>
    );
};

export default TopBar;
