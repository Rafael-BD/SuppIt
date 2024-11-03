import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const fetchCreatorPageData = async (creatorUser: string) => {
    try {
        const response = await axios.get(`${API_URL}/creator?creator_user=${creatorUser}`);
        return response.data;
    } catch (error) {
        return (error as any).response;
    }
};

export const fetchRecentDonations = async (creatorUser: string) => {
    try {
        const response = await axios.get(`${API_URL}/donations?creator_user=${creatorUser}`);
        return response.data;
    } catch (error) {
        return (error as any).response;
    }
};

export const donate = async (data: { creator_user: string; amount: number, donorName: string, donorEmail: string, donorComment: string }) => {
    try {
        const response = await axios.post(`${API_URL}/donate`, data);
        return response.data;
    } catch (error) {
        return (error as any).response;
    }
};

export const login = async (data: { email: string; password: string }) => {
    try {
        const response = await axios.post(`${API_URL}/login`, data, { withCredentials: true });
        return response;
    } catch (error) {
        return (error as any).response;
    }
};

export const signup = async (data: {name: string; user: string; email: string; password: string}) => {
    try {
        const response = await axios.post(`${API_URL}/account-register`, data);
        return response;
    } catch (error) {
        return (error as any).response;
    }
};

export const updateAccount = async (data: { name: string; email: string; user: string; oldPassword: string; newPassword: string; confirmPassword: string }) => {
    try {
        const response = await axios.put(`${API_URL}/account-update`, data, { withCredentials: true });
        return response;
    } catch (error) {
        return (error as any).response;
    }
};

export const createPage = async (data: { description: string; socials: string[], banner_img: string, profile_img: string }) => {
    try {
        const response = await axios.post(`${API_URL}/page-create`, data, { withCredentials: true });
        return response;
    } catch (error) {
        return (error as any).response;
    }
};

export const updatePage = async (data: { description: string; socials: string[], banner_img: string, profile_img: string }) => {
    try {
        const response = await axios.put(`${API_URL}/page-update`, data, { withCredentials: true });
        return response;
    } catch (error) {
        return (error as any).response;
    }
};

export const fetchAccountData = async () => {
    try {
        const response = await axios.get(`${API_URL}/account`, { withCredentials: true });
        return response.data;
    } catch (error) {
        return (error as any).response;
    }
};

export const checkIfAccountExists = async (data: { email: string, user: string, name: string }) => {
    try {
        const response = await axios.post(`${API_URL}/account-check`, data, { withCredentials: true });
        return response;
    } catch (error) {
        return (error as any).response;
    }
};

export const registerStripe = async () => {
    try {
        const response = await axios.get(`${API_URL}/account-stripe`, { withCredentials: true });
        return response;
    } catch (error) {
        return (error as any).response;
    }
};
