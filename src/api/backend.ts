import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const fetchCreatorPageData = async (creatorUser: string) => {
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

export const login = async (data: { email: string; password: string }) => {
    const response = await axios.post(`${API_URL}/login`, data, { withCredentials: true });
    return response;
};

export const signup = async (data: {name: string; user: string; email: string; password: string}) => {
    const response = await axios.post(`${API_URL}/account-register`, data);
    return response;
};

export const updateAccount = async (data: { name: string; email: string; password: string, user: string }) => {
    const response = await axios.put(`${API_URL}/account-update`, data, { withCredentials: true });
    return response;
};

export const createPage = async (data: { description: string; socials: string[], banner_img: string, profile_img: string }) => {
    const response = await axios.post(`${API_URL}/page-create`, data, { withCredentials: true });
    return response;
};

export const updatePage = async (data: { description: string; socials: string[], banner_img: string, profile_img: string }) => {
    const response = await axios.put(`${API_URL}/page-update`, data, { withCredentials: true });
    return response;
};

export const fetchAccountData = async () => {
    const response = await axios.get(`${API_URL}/account`, { withCredentials: true });
    return response.data;
};

