import { Router } from "express";
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
    getVideoPlaylist,
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkUser } from "../middlewares/openAuth.middleware.js";

const router = Router();

router.route("/:playlistId").get(checkUser, getPlaylistById);
router.route("/user/:userId").get(checkUser, getUserPlaylists);

router.use(verifyJWT);

router.route("/").post(createPlaylist);

router.route("/:playlistId").patch(updatePlaylist).delete(deletePlaylist);

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist);
router.route("/user/p/:videoId").get(getVideoPlaylist);

export default router;
