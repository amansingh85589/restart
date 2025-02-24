// import multer from "multer";



// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, '../public/temp')
//     },
//     filename: function (req, file, cb) {
//     //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, file.originalname)
//     }
//   })
  
// //   const upload = multer({ storage: storage })

//   export const upload = multer({
//     storage 
//   })

import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(process.cwd(), "public", "temp"); // Ensures correct absolute path
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

export const upload = multer({ storage });
