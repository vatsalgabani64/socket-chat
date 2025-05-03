import {create} from 'zustand';
import {axiosInstance} from '../lib/axios.js';
import { useAuthStore } from './useAuthStore.js';

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
        }
    },

    subscribeToMessages: ()=>{
        const {selectedUser} = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage",(newMessage)=>{
            const isMessageBySelectedUser = newMessage.senderId === selectedUser._id || newMessage.receiverId === selectedUser._id;
            if(!isMessageBySelectedUser) return;
            set({messages:[...get().messages,newMessage]});
        })
    },

    unsubscribeFromMessages:()=>{
        const socket = useAuthStore.getState().socket;
        socket.off("newMessages");
    },

    setSelectedUser: (selectedUser)=>set({selectedUser}),
}));
