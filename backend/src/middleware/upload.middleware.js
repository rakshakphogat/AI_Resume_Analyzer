import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, "src/uploads");
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext).replace(/\s+/g, "-").toLowerCase();
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${baseName}-${uniqueSuffix}${ext}`);
    },
});

const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const fileFilter = (_req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
        const error = new Error("Only PDF and DOCX files are allowed");
        error.statusCode = 400;
        return cb(error);
    }

    return cb(null, true);
};

export const uploadResume = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});
