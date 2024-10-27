'use client';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { w } from 'windstitch';
import { Button } from '@/src/components/ui/button';
import { useParams } from 'next/navigation';
import { RadioGroup } from '@/src/components/ui/radio-group';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/src/components/ui/dropdown-menu';
import { FaTwitter, FaInstagram, FaYoutube, FaLock, FaSun, FaMoon } from 'react-icons/fa';

interface CreatorProps {
    id: number;
    name: string;
    description: string;
    socials: string[];
    creatorUser: string;
}

interface DonationProps {
    id: number;
    donor_name: string;
    amount: number;
    comment: string;

}

const Container = w('div', {
    className: 'flex flex-col items-center justify-start min-h-screen bg-[hsl(var(--background))] pt-0 pb-16',
});

const TopBar = w('div', {
    className: 'w-full flex items-center justify-between bg-[hsl(var(--card))] shadow-md p-4 fixed top-0',
});

const Logo = w('h1', {
    className: 'text-lg font-bold cursor-pointer text-[hsl(var(--foreground))]',
});

const Banner = w('div', {
    className: 'w-full h-40 bg-[hsl(var(--muted))] bg-cover bg-center mt-[4rem]',
});

const Content = w('div', {
    className: 'flex flex-col md:flex-row w-full max-w-6xl mt-4 space-y-4 md:space-y-0 md:space-x-4 p-4',
});

const Card = w('div', {
    className: 'bg-[hsl(var(--primary-foreground))] rounded-xl border border-[hsl(var(--border))] p-6',
});

const ProfileSection = w('div', {
    className: 'flex flex-col items-start space-y-4',
});

const ProfileImage = w('img', {
    className: 'w-24 rounded-full object-cover border-4 border-[hsl(var(--card))]',
});

const Title = w('h1', {
    className: 'text-2xl font-bold mt-1 text-[hsl(var(--foreground))]',
});

const Description = w('p', {
    className: 'text-[hsl(var(--muted-foreground))]',
});

const SocialLinks = w('div', {
    className: 'flex space-x-4 mt-6',
});

const SocialLink = w('a', {
    className: 'text-[hsl(var(--primary))] hover:underline text-2xl',
});

const DonationItem = w('div', {
    className: 'border-b border-[hsl(var(--border))] py-2',
});

const CreatorPage = () => {
    const { creatorUser } = useParams();
    const [creator, setCreator] = useState<CreatorProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [donationAmount, setDonationAmount] = useState(500);
    const [donorName, setDonorName] = useState('');
    const [donorEmail, setDonorEmail] = useState('');
    const [donorComment, setDonorComment] = useState('');
    const [customSupps, setCustomSupps] = useState<string>('');
    const [recentDonations, setRecentDonations] = useState<DonationProps[]>([]);
    const [showAllDonations, setShowAllDonations] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const customSuppsInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchCreatorData = async () => {
            if (creatorUser) {
                try {
                    const response = await axios.get(`http://localhost:8000/creator?creator_user=${creatorUser}`);
                    setCreator(response.data);
                } catch (error) {
                    console.error('Error fetching creator data:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        const fetchRecentDonations = async () => {
            if (creatorUser) {
                try {
                    // TODO: fetch recent donations from API
                    const response = await axios.get(`http://localhost:8000/donations?creator_user=${creatorUser}`);
                    setRecentDonations(response.data);
                } catch (error) {
                    // preenche com dados fake
                    setRecentDonations([
                        { id: 1, donor_name: 'John Doe', amount: 500, comment: 'Great content!' },
                        { id: 2, donor_name: 'Jane Doe', amount: 1000, comment: 'Keep it up!' },
                        { id: 3, donor_name: 'Alice Doe', amount: 1500, comment: 'Love your work!' },
                    ]);
                    console.error('Error fetching recent donations:', error);
                }
            }
        };

        fetchCreatorData();
        fetchRecentDonations();
    }, [creatorUser]);

    const handleDonate = async () => {
        if (!creatorUser || !donorName || !donorEmail) return;

        try {
            const response = await axios.post('http://localhost:8000/checkout', {
                amount: donationAmount,
                creator_user: creatorUser,
                donorName,
                donorEmail,
                donorComment,
            });

            const { url } = response.data;
            window.location.href = url;
        } catch (error) {
            console.error('Error during donation process:', error);
        }
    };

    const handleSuppChange = (value: number) => {
        setCustomSupps('');
        setDonationAmount(value);
    };

    const handleCustomSuppsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomSupps(e.target.value);
        const value = Number(e.target.value);
        if (!isNaN(value) && value >= 1) {
            setDonationAmount(value * 500);
        } else {
            setDonationAmount(500); // Valor mínimo de 5 reais
        }
    };
    
    const handleCustomSuppsBlur = () => {
        let value = customSupps === '' ? 0 : Number(customSupps);
        if (value < 1 || customSupps === '') value = 1;
        setCustomSupps(value === 0 ? '' : value.toString());
        setDonationAmount(value * 500);
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark', !isDarkMode);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!creator) {
        return <div>Creator not found</div>;
    }

    const getSocialIcon = (social: string) => {
        if (social.includes('x.com')) return <FaTwitter />;
        if (social.includes('instagram.com')) return <FaInstagram />;
        if (social.includes('youtube.com')) return <FaYoutube />;
        return <FaLock />;
    };

    return (
        <Container>
            <TopBar>
                <Logo onClick={() => window.location.href = '/'}>Supp.It</Logo>
                <div className="flex items-center space-x-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="text-lg">...</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => console.log('Share')}>Share</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => console.log('Report')}>Report</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline">Login</Button>
                    <Button variant="ghost" onClick={toggleTheme}>
                        {!isDarkMode ? <FaSun /> : <FaMoon />}
                    </Button>
                </div>
            </TopBar>

            <Banner style={{ backgroundImage: 'url(https://via.placeholder.com/600x150)' }} />
            <Content>
                <Card className="flex-1 md:flex-[0_0_35%]">
                    <ProfileSection>
                        <ProfileImage src="https://via.placeholder.com/150" alt="Creator Profile" />
                        <div>
                            <Title>{creator.name}</Title>
                        </div>
                        <Description>{creator.description}</Description>
                    </ProfileSection>
                    <SocialLinks>
                        {creator.socials.map((social) => {
                            const formattedSocial = social.startsWith('http') ? social : `https://${social}`;
                            return (
                                <SocialLink key={social} href={formattedSocial} target="_blank">
                                    {getSocialIcon(social)}
                                </SocialLink>
                            );
                        })}
                    </SocialLinks>
                    <hr className="my-4 border-[hsl(var(--border))]" />
                    <div className="mt-4">
                        <h2 className="font-semibold text-lg text-[hsl(var(--foreground))]">Recent Donations</h2>
                        {recentDonations.slice(0, showAllDonations ? recentDonations.length : 5).map((donation) => (
                            <DonationItem key={donation.id}>
                                <p><strong>{donation.donor_name}</strong> donated R$ {(donation.amount / 100).toFixed(2)}</p>
                                <p>{donation.comment}</p>
                            </DonationItem>
                        ))}
                        {recentDonations.length > 5 && (
                            <Button variant="outline" onClick={() => setShowAllDonations(!showAllDonations)}>
                                {showAllDonations ? 'Show Less' : 'Show More'}
                            </Button>
                        )}
                    </div>
                </Card>

                <Card className="flex-1 md:flex-[0_0_65%]">
                    <h2 className="font-semibold text-lg mb-4 text-[hsl(var(--foreground))]">Support {creator.name}</h2>
                    <div className="mb-4">
                        <RadioGroup className="flex flex-wrap space-x-2" value={donationAmount.toString()} onValueChange={(value) => handleSuppChange(Number(value))}>
                            {[1, 2, 3].map((supp) => (
                                <Button
                                    key={supp}
                                    variant={donationAmount === supp * 500 ? 'default' : 'outline'}
                                    onClick={() => handleSuppChange(supp * 500)}
                                    className="p-4 flex-1"
                                >
                                    {supp}x Supps (R$ {(supp * 500 / 100).toFixed(2)})
                                </Button>
                            ))}
                            <div className="flex items-center space-x-2 flex-1">
                                <input
                                    type="number"
                                    placeholder="Custom Supps"
                                    value={customSupps}
                                    ref={customSuppsInputRef}
                                    onChange={handleCustomSuppsChange}
                                    onBlur={handleCustomSuppsBlur}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleCustomSuppsBlur();
                                            customSuppsInputRef.current?.blur();
                                        }
                                    }}
                                    className="p-2 border rounded bg-[hsl(var(--input))] text-[hsl(var(--foreground))] text-sm w-full"
                                />  
                                </div>
                    </RadioGroup>
                    </div>
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        className="mb-4 p-2 border rounded w-full bg-[hsl(var(--input))] text-[hsl(var(--foreground))]"
                    />
                    <input
                        type="email"
                        placeholder="Your Email"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        className="mb-4 p-2 border rounded w-full bg-[hsl(var(--input))] text-[hsl(var(--foreground))]"
                    />
                    <textarea
                        placeholder="Your Comment"
                        value={donorComment}
                        onChange={(e) => setDonorComment(e.target.value)}
                        className="mb-4 p-2 border rounded w-full bg-[hsl(var(--input))] text-[hsl(var(--foreground))]"
                    />
                    <Button className="mt-4 w-full" onClick={handleDonate}>
                        Donate R$ {(donationAmount / 100).toFixed(2)}
                    </Button>
                </Card>
            </Content>
        </Container>
    );
};

export default CreatorPage;
