import express from "express";
import { authenticateJwt, isSuperAdmin } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";
import {
  addFeatureBanners,
  fetchFeatureBanners,
  getFeaturedProducts,
  updateFeaturedProducts,
} from "../controllers/settingController";

const router = express.Router();

router.post(
  "/banners",
  authenticateJwt,
  isSuperAdmin,
  upload.array("images", 5),
  addFeatureBanners
);

// Public routes, tanpa autentikasi
router.get("/get-banners", fetchFeatureBanners);
router.get("/fetch-feature-products", getFeaturedProducts);

router.post(
  "/update-feature-products",
  authenticateJwt,
  isSuperAdmin,
  updateFeaturedProducts
);

export default router;
