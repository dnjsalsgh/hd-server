import { RequestHandler } from 'express';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import multer from 'multer';
// 디렉토리 선언
export const dir = {
  upper: '../../',
  upload: 'uploads',
  file: 'files/attach',
  image: {
    company: 'images/company',
    user: 'images/user',
    post: 'images/post',
  },
};
const uploadPathFile = path.join(__dirname, dir.upper, dir.file);
const uploadPathImageCompany = path.join(
  __dirname,
  dir.upper,
  dir.upload,
  dir.image.company,
);
const uploadPathImageUser = path.join(
  __dirname,
  dir.upper,
  dir.upload,
  dir.image.user,
);
const uploadPathImagePost = path.join(
  __dirname,
  dir.upper,
  dir.upload,
  dir.image.post,
);

if (!fs.existsSync(uploadPathFile)) {
  fs.mkdirSync(uploadPathFile, { recursive: true });
}
if (!fs.existsSync(uploadPathImageCompany)) {
  fs.mkdirSync(uploadPathImageCompany, { recursive: true });
}
if (!fs.existsSync(uploadPathImageUser)) {
  fs.mkdirSync(uploadPathImageUser, { recursive: true });
}
if (!fs.existsSync(uploadPathImagePost)) {
  fs.mkdirSync(uploadPathImagePost, { recursive: true });
}
// 파일 포맷
export const format = {
  file: 'file',
  image: 'image',
};
// 파일 체크 선언(파일 포맷에 따른다)
const filter: {
  [key: string]: string;
} = {
  file: 'jpeg|jpg|png|gif|bmp|ppt|pptx|potx|ppsx|thmx|odp|show|hsdt|htheme|doc|docx|hwp|hwt|hwpx|Hwtx|odt|xml|rtf|odf|2b|xls|xlsx|xlsm|xlsb|obs|hcdt|csv|txt|pm|mht|mhtml|htm|html|dbf|cell|nxl|pdf|ai|psd|zip|7z|tar|gz|mp3|mp4|wav|avi',
  image: 'jpeg|jpg|png|gif|bmp',
};
// 파일 사이즈 세팅(파일 포맷에 따른다)
const size: {
  [key: string]: number;
} = {
  file: 50 * 1024 * 1024,
  image: 5 * 1024 * 1024,
};

// =TODO 파일업로드 무조건 files/attach에 저장되는 문제
// 단일 파일 업로드
export const uploadFile = (
  paramName: string,
  fileDir: string,
  fileFormat: string,
): RequestHandler => {
  let fileDirWeb = '';

  // files 디렉토리랑 분기
  if (fileDir === dir.file) {
    fileDirWeb = `${fileDir}`;
  } else {
    fileDirWeb = `${dir.upload}/${fileDir}`;
  }
  const fileTypeCheck = new RegExp(filter[fileFormat]);
  const fileSize = size[fileFormat];

  // multer 호출
  const upload = multer({
    storage: multer.diskStorage({
      destination(req, file, done) {
        done(null, fileDirWeb);
      },
      filename(req, file, done) {
        const ext = path.extname(file.originalname).toLowerCase();
        const uuid = uuidv4();
        done(null, uuid + ext);
      },
    }),
    limits: { fileSize },
    fileFilter: (req, file, done) => {
      checkType(file, done, fileTypeCheck);
    },
  });
  console.log('upload = ', upload);
  return upload.single(paramName);
};
// 다중 파일 업로드
export const uploadFiles = (
  paramName: string,
  fileDir: string,
  fileFormat: string,
): RequestHandler => {
  let fileDirWeb = '';

  // files 디렉토리랑 분기
  if (fileDir === dir.file) {
    fileDirWeb = `${fileDir}`;
  } else {
    fileDirWeb = `${dir.upload}/${fileDir}`;
  }
  const fileTypeCheck = new RegExp(filter[fileFormat]);
  const fileSize = size[fileFormat];

  // multer 호출
  const upload = multer({
    storage: multer.diskStorage({
      destination(req, file, done) {
        done(null, fileDirWeb);
      },
      filename(req, file, done) {
        file.originalname = decodeURIComponent(file.originalname);
        console.log(file.originalname);
        const ext = path.extname(file.originalname).toLowerCase();
        const uuid = uuidv4();
        done(null, uuid + ext);
      },
    }),
    limits: { fileSize },
    fileFilter: (req, file, done) => {
      checkType(file, done, fileTypeCheck);
    },
  });
  return upload.array(paramName);
};

function checkType(
  file: Express.Multer.File,
  done: multer.FileFilterCallback,
  filetypes: RegExp,
) {
  const ext = path.extname(file.originalname).toLowerCase();
  // Check ext
  const extname = filetypes.test(ext);
  // // Check mime
  // const mimetype = filetypes.test(file.mimetype);
  // console.log(file);
  // console.log(mimetype);
  if (extname) {
    return done(null, true);
  } else {
    return done(null, false);
  }
}
