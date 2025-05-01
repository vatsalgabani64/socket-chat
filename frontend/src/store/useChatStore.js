import {create} from 'zustand';
import {axiosInstance} from '../lib/axios.js';

export const useChatStore = create((set,get) => ({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,

    getUsers: async()=>{
        set({isUsersLoading:true});
        try{
            const response = await axiosInstance.get("/message/users");
            set({users:response.data});
        }catch(err){
            toast.error(err.response.data.message);
        }finally{
            set({isUsersLoading:false});
        }
    },

    getMessages: async(userId)=>{
        set({isMessagesLoading:true});
        try{
            const response = await axiosInstance.get(`/message/${userId}`);
            set({messages:response.data});
        }catch(err){
            toast.error(err.response.data.message);
        }finally{
            set({isMessagesLoading:false});
        }
    },

    sendMessage:async(messageData)=>{
        const {selectedUser,messages} = get()
        try{
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`,messageData);
            set({messages:[...messages,res.data]})
        }catch(error){
            toast.error(err.response.data.message);
        }finally{

        }
    },

    setSelectedUser: (selectedUser)=>set({selectedUser}),
}));
