import multer from 'multer';

export const bodyParserMulterMemoryStorage = multer({
  dest: 'files',
  storage: multer.memoryStorage()
});
