// utils/uploadImage.js
import axiosInstance from "./axiosInstance";
import { BASE_URL } from "./constants";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axiosInstance.post(
      "/image-upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Assuming response includes { imageName: 'xyz.jpg' }
    const imageName = response.data.imageName || response.data.filename || "";

    return {
      ...response.data,
      imageUrl: `${BASE_URL}/uploads/${imageName}`,
    };
  } catch (error) {
    console.error("Error uploading the image:", error);
    throw error;
  }
};

export default uploadImage;