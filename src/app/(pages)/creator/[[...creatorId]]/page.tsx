'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { w } from 'windstitch';
import { Button } from '@/src/components/ui/button';
import { useParams } from 'next/navigation';
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/radio-group';
import { Label } from '@/src/components/ui/label';

interface CreatorProps {
    id: number;
    name: string;
    description: string;
    socials: string[];
}

const Container = w('div', {
    className: 'flex flex-col items-center justify-center min-h-screen py-2',
});

const Card = w('div', {
    className: 'bg-white p-6 rounded-lg shadow-lg max-w-md w-full',
});

const Title = w('h1', {
    className: 'text-2xl font-bold mb-4',
});

const Description = w('p', {
    className: 'text-gray-700 mb-4',
});

const SocialLinks = w('div', {
    className: 'flex space-x-4',
});

const SocialLink = w('a', {
    className: 'text-blue-500 hover:underline',
});

const CreatorPage = () => {
    const { creatorId } = useParams();
    const [creator, setCreator] = useState<CreatorProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [donationAmount, setDonationAmount] = useState(500); // Valor padrão em centavos (R$ 5,00)
    const [donorName, setDonorName] = useState('');
    const [donorEmail, setDonorEmail] = useState('');
    const [customSupps, setCustomSupps] = useState<number | null>(null);

    useEffect(() => {
        const fetchCreatorData = async () => {
            if (creatorId) {
                try {
                    const response = await axios.get(`http://localhost:8000/creator?creator_id=${creatorId}`);
                    setCreator(response.data);
                } catch (error) {
                    console.error('Error fetching creator data:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchCreatorData();
    }, [creatorId]);

    const handleDonate = async () => {
        if (!creatorId || !donorName || !donorEmail) return;

        try {
            const response = await axios.post('http://localhost:8000/checkout', {
                amount: donationAmount,
                accountId: creatorId,
                donorName,
                donorEmail,
            });

            const { url } = response.data;
            window.location.href = url;
        } catch (error) {
            console.error('Error during donation process:', error);
        }
    };

    const handleSuppChange = (value: number) => {
        setCustomSupps(null);
        setDonationAmount(value); // Multiplica o valor base de 5 reais (500 centavos)
    };

    const handleCustomSuppsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setCustomSupps(value);
        setDonationAmount(value * 500); // Multiplica o valor base de 5 reais (500 centavos)
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!creator) {
        return <div>Creator not found</div>;
    }

    return (
        <Container>
            <Card>
                <Title>{creator.name}</Title>
                <Description>{creator.description}</Description>
                <SocialLinks>
                    {creator.socials.map((social) => {
                        let platformName = 'Social';
                        if (social.includes('x.com')) {
                            platformName = 'X';
                        } else if (social.includes('instagram.com')) {
                            platformName = 'Instagram';
                        } else if (social.includes('youtube.com')) {
                            platformName = 'YouTube';
                        }
                        const formattedSocial = social.startsWith('http') ? social : `https://${social}`;
                        return (
                            <SocialLink key={social} href={formattedSocial} target="_blank">
                                {platformName}
                            </SocialLink>
                        );
                    })}
                </SocialLinks>
                <RadioGroup className="mb-4" value={donationAmount.toString()} onValueChange={(value) => handleSuppChange(Number(value))}>
                    {[1, 2, 3, 4, 5].map((supp) => (
                        <div key={supp} className="flex items-center space-x-2">
                            <RadioGroupItem
                                value={(supp * 500).toString()}
                                id={`supp-${supp}`}
                                checked={donationAmount === supp * 500}
                            />
                            <Label htmlFor={`supp-${supp}`}>{supp}x Supps</Label>
                        </div>
                    ))}
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem
                            value="custom"
                            id="custom-amount"
                            checked={customSupps !== null}
                            onChange={() => setCustomSupps(customSupps)}
                        />
                        <Label htmlFor="custom-amount">
                            <input
                                type="number"
                                placeholder="Quantidade personalizada de Supps"
                                value={customSupps ?? ''}
                                onChange={handleCustomSuppsChange}
                                className="p-2 border rounded"
                            />
                        </Label>
                    </div>
                </RadioGroup>
                <div className="mb-4">
                    <span>Valor da doação: R$ {(donationAmount / 100).toFixed(2)}</span>
                </div>
                <input
                    type="text"
                    placeholder="Seu nome"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="mb-4 p-2 border rounded"
                />
                <input
                    type="email"
                    placeholder="Seu email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="mb-4 p-2 border rounded"
                />
                <Button className="mt-4" onClick={handleDonate}>Support</Button>
            </Card>
        </Container>
    );
};

export default CreatorPage;