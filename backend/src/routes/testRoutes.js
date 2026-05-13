import express from "express";
import protect from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";

const router = express.Router();

// USER ROUTE
router.get("/user", protect, (req, res) => {
  res.json({
    message: "User route accessed",
    user: req.user,
  });
});

// ADMIN ROUTE
router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
  res.json({
    message: "Admin route accessed",
  });
});

export default router;
