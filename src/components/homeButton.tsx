import { w } from 'windstitch';

const HomeButtonContainer = w('div', {
    className: '',
});

const HomeButton = () => {
    return (
        <HomeButtonContainer>
            <button
                onClick={() => window.location.href = '/'}
                className="text-lg font-bold text-[hsl(var(--foreground))]"
            >
                Supp.It
            </button>
        </HomeButtonContainer>
    );
};

export default HomeButton;