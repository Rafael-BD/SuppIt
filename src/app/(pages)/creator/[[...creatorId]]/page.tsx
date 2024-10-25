'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { w } from 'windstitch';
import { Button } from '@/src/components/ui/button';
import { useParams } from 'next/navigation';

interface CreatorProps {
    id: number
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
        if (!creatorId) return;

        try {
            const amount = 5000; // Valor da doação em centavos (R$ 50,00)
            const response = await axios.post('http://localhost:8000/checkout', {
                amount,
                accountId: creatorId,
            });

            const { url } = response.data;
            window.location.href = url;

            // Após a conclusão do pagamento, você pode enviar uma requisição para /donate
            // Isso deve ser feito no backend após a confirmação do pagamento
        } catch (error) {
            console.error('Error during donation process:', error);
        }
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
                <Button className="mt-4" onClick={handleDonate}>Support</Button>
            </Card>
        </Container>
    );
};

export default CreatorPage;