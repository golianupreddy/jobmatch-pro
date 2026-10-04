import multer from 'multer';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED = { 'application/pdf': '.pdf', 'text/plain': '.txt' };

const httpError = (message, status = 400) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.toLowerCase().match(/\\.[a-z0-9]+$/)?.[0];
    const valid = Object.hasOwn(ALLOWED, file.mimetype) && ext === ALLOWED[file.mimetype];
    if (!valid) return cb(httpError('Only .pdf or .txt resume files are allowed'));
    cb(null, true);
  },
});

const receiveResume = (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(413);
        return next(new Error('File too large. Maximum size is 5 MB'));
      }
      res.status(400);
      return next(new Error(`Upload error: ${err.message}`));
    }
    res.status(err.status || 500);
    next(err);
  });
};

const validateResumeFile = (req, res, next) => {
  const file = req.file;
  if (!file) {
    res.status(400);
    return next(new Error('Resume file is required (form field name: resume)'));
  }
  if (file.mimetype === 'application/pdf') {
    if (file.buffer.subarray(0, 5).toString('latin1') !== '%PDF-') {
      res.status(400);
      return next(new Error('Invalid PDF file'));
    }
  } else if (file.buffer.includes(0)) {
    res.status(400);
    return next(new Error('Invalid text file'));
  }
  next();
};

export const resumeUpload = [receiveResume, validateResumeFile];
