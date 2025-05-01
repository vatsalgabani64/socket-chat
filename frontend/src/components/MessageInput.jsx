import React, { useState,useRef} from 'react'
import { useChatStore } from '../store/useChatStore';

const MessageInput = () => {
  const [text,setText] = useState("");
  const[previewImage,setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const {sendMeassage} = useChatStore();

  handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div>MessageInput</div>
  )
}

export default MessageInput;