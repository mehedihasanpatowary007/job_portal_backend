import axios from "axios";

export const uploadImage = async (profilePhoto) => {
  const form = new FormData();
  form.append("key", "db3c8257d74b1067734dae462ee53638");
  form.append("image", profilePhoto);
  try {
    const res = await axios.post("https://api.imgbb.com/1/upload", form);

    return res.data.data.url;
  } catch (error) {
    console.log("Error Inside the UploadImage function:", error);
    throw new Error("Image Upload Failed.");
  }
};
