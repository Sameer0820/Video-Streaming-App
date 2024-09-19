import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkUser } from "../middlewares/openAuth.middleware.js";
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js";

const router = Router();

router.route("/:videoId").get(checkUser, getVideoComments);

router.use(verifyJWT);

router.route("/:videoId").post(addComment);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router;