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

    console.log("📷 Image Upload Response:", response.data);

    const imageName = response.data.filename || response.data.imageName || "";

    const finalUrl = `${BASE_URL}/uploads/${imageName}`;
    console.log("🧩 Final constructed imageUrl:", finalUrl);

    return {
      ...response.data,
      imageUrl: finalUrl,
    };
  } catch (error) {
    console.error("❌ Error uploading the image:", error.response?.data || error.message);
    throw error;
  }
};

export default uploadImage;