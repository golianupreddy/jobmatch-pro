import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  console.log('Incoming file upload:', { name: file.originalname, mimetype: file.mimetype });
  
  const ext = file.originalname ? file.originalname.toLowerCase().split('.').pop() : '';
  const isAllowedExt = ['pdf', 'txt'].includes(ext);
  const isAllowedMime = file.mimetype.includes('pdf') || file.mimetype.includes('text') || file.mimetype === 'application/octet-stream';

  if (isAllowedExt || isAllowedMime) {
    cb(null, true);
  } else {
    cb(new Error('Only .pdf or .txt resume files are allowed'), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});
