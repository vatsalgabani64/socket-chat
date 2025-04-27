import {create} from 'zustand';
import {axiosInstance} from '../lib/axios.js';

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,

    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get('/auth/check');
            set({authUser:response.data});
        } catch (error) {
            console.log('Error checking auth:', error);
            set({ authUser: null});
        }finally {
            set({ isCheckingAuth: false });
        }
    },
    
    signup: async (userData) => {
        set({isSigningUp:true});
        try {
            const response = await axiosInstance.post('/auth/signup', userData);
            set({authUser:response.data});
        } catch (error) {
            console.log('Error signing up:', error);
        }finally {
            set({isSigningUp:false});
        }
    },
}));