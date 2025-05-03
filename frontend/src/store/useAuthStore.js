import {create} from 'zustand';
import {axiosInstance} from '../lib/axios.js';
import toast from 'react-hot-toast';
import {io} from 'socket.io-client';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set,get) => ({
    authUser: null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth: true,
    onlineUsers:[],
    socket:null,

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get('/auth/check');
            set({authUser:response.data});
            get().connectSocket();
        } catch (error) {
            console.log('Error checking auth:', error);
            set({ authUser: null});
        }finally {
            set({ isCheckingAuth: false });
        }
    },
    
    signup: async (userData) => {
        set({isSigningUp:true});
        console.log('userData', userData);
        try {
            const response = await axiosInstance.post('/auth/signup', userData);
            set({authUser:response.data});
            toast.success('Account created successfully!');

            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message );
        }finally {
            set({isSigningUp:false});
        }
    },

    login: async (userData) => {
        set({isLoggingIn:true});
        console.log('userData', userData);
        try {
            const response = await axiosInstance.post('/auth/login', userData);
            set({authUser:response.data});
            toast.success('Logged in successfully!');

            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message );
        }finally {
            set({isLoggingIn:false});
        }
    },

    logout: async() => {
        try {
            await axiosInstance.post('/auth/logout');
            set({authUser:null});
            toast.success('Logged out successfully!');
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message );
        }
    },

    updateProfile: async (userData) => {
        set({isUpdatingProfile:true});
        console.log('userData', userData);
        try {
            const response = await axiosInstance.post('/auth/update-profile', userData);
            set({authUser:response.data});
            toast.success('Profile Updated successfully!');
        } catch (error) {
            toast.error(error.response.data.message );
        }finally {
            set({isUpdatingProfile:false});
        }
    },

    connectSocket: ()=>{
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;

        const socket=io(BASE_URL,{
            query:{
                userId: authUser._id,
            }
        });
        socket.connect();

        set({socket:socket});

        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers:userIds});
        })
    },
    disconnectSocket: ()=>{
        if(get().socket?.connected) get().socket.disconnect();
    }
}));