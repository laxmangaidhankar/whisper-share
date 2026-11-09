import { Router } from "express";
import {
    createInstantShare,
    downloadInstantShare,
    retrieveInstantShare
} from "../controllers/instantShare.controller.js";
import { encryptedFileUpload } from "../middlewares/upload.middleware.js";

const router = Router();

router.post("/upload", encryptedFileUpload, createInstantShare);
router.get("/:code/content", downloadInstantShare);
router.get("/:code", retrieveInstantShare);

export default router;