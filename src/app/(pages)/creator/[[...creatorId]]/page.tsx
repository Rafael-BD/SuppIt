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
    social_links: {
        twitter?: string;
        instagram?: string;
        facebook?: string;
    };
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
    const {creatorId} = useParams();
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
    }, []);

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
                    {creator.social_links.twitter && (
                        <SocialLink href={creator.social_links.twitter} target="_blank">
                            Twitter
                        </SocialLink>
                    )}
                    {creator.social_links.instagram && (
                        <SocialLink href={creator.social_links.instagram} target="_blank">
                            Instagram
                        </SocialLink>
                    )}
                    {creator.social_links.facebook && (
                        <SocialLink href={creator.social_links.facebook} target="_blank">
                            Facebook
                        </SocialLink>
                    )}
                </SocialLinks>
                <Button className="mt-4">Support</Button>
            </Card>
        </Container>
    );
};

export default CreatorPage;