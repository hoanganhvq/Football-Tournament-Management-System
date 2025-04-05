const cloudinary = require('../config/cloudinary');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

// Upload ảnh cho Club/Player
const uploadImageTournamentAndPlayer = async (req, res) => {
  try {

    console.log('Uploading');
    const { id } = req.params;
    const file = req.file; 
    console.log("asdf: ", file);
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      public_id: id,
    });

    fs.unlinkSync(file.path); // Xóa file tạm
    res.status(200).json({ message: 'Image uploaded successfully', data: result });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Upload failed' });
  }
};

// Upload ảnh cho Tournament
const uploadImageClub = async (req, res) => {
  try {
    const { id, type } = req.params;
    const file = req.file; 
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    console.log("Uploading file")
    const result = await cloudinary.uploader.upload(file.path, {
      public_id: `${id}_${type}`, // Ví dụ: "giai_dau_2025_cover"
    });

    fs.unlinkSync(file.path); // Xóa file tạm
    res.status(200).json({ message: 'Image uploaded successfully', data: result });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Upload failed' });
  }
};

// Lấy URL ảnh
const getImage = (req, res) => {
  const { id, type } = req.params;
  const imageUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/image/upload/${id}_${type}.jpg`; // Sửa cú pháp template string
  res.json({ image: imageUrl });
};

module.exports = { uploadImageTournamentAndPlayer, uploadImageClub, getImage };