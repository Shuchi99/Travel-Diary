require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config(process.env.CLOUDINARY_URL);

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'travel_diary_uploads',
    public_id: (req, file) => {
      const name = file.originalname.split('.')[0];
      return `${Date.now()}-${name}`;
    },
  },
});

module.exports = {
  cloudinary,
  storage,
};
