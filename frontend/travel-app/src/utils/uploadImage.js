import axios from "axios";
import { BASE_URL } from "./constants";

const uploadImage = async(imageFile) => {
    const formData = new FormData();
    formData.append('image',imageFile);

    const accessToken = localStorage.getItem("token");

    try{
        const response = await axios.post(`${BASE_URL}/image-upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error){
        console.error("Upload image failed:", error?.response?.data || error.message);
        throw error;
    }
};

export default uploadImage;