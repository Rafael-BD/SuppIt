import axios from 'axios';

const API_URL = 'https://suppit-backend.deno.dev';

export const fetchCreatorData = async (creatorUser: string) => {
    const response = await axios.get(`${API_URL}/creator?creator_user=${creatorUser}`);
    return response.data;
};

export const fetchRecentDonations = async (creatorUser: string) => {
    const response = await axios.get(`${API_URL}/donations?creator_user=${creatorUser}`);
    return response.data;
};

export const donate = async (data: { creator_user: string; amount: number, donorName: string, donorEmail: string, donorComment: string }) => {
    const response = await axios.post(`${API_URL}/donate`, data);
    return response.data;
};