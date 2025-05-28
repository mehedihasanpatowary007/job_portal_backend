import fs from "fs";
import path from "path";
import cloudinary from "./cloudinary.js";

export const uploadPdf = async (base64Data, fullName) => {
  try {
    if (!base64Data || !fullName) {
      throw new Error("Missing base64 data or user name");
    }

    const resumeBuffer = Buffer.from(base64Data, "base64");
    const safeName = fullName.replace(/\s+/g, "_").toLowerCase();
    const tempDir = path.resolve("./temp");
    const tempFilePath = path.join(tempDir, `${safeName}-resume.pdf`);

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    fs.writeFileSync(tempFilePath, resumeBuffer);

    const cloudinaryResponse = await cloudinary.uploader.upload(tempFilePath, {
      resource_type: "raw",
      folder: "pdf",
      public_id: `${safeName}_resume`,
      
    });

    fs.unlinkSync(tempFilePath);

    return cloudinaryResponse.secure_url;
  } catch (error) {
    console.error("Error saving PDF with username:", error);
    throw error;
  }
};
