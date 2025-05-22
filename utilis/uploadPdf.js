import cloudinary from "./cloudinary.config.js";
const uploadPDF = async (base64, id) => {
  try {
    const result = await cloudinary.uploader.upload(base64, {
      resource_type: "raw",
      folder: "resumes",
      public_id: `${id}.pdf` ,
      overwrite: true, 
    });
    return result.secure_url;
  } catch (error) {
    console.error("PDF Upload Error:", error.message);
  }
};

export default uploadPDF;
