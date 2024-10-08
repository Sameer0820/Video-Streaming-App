import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
        console.log(req);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
        console.log(req);
    },
});

export const upload = multer({ storage });
