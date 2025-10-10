const express = require("express");
const router = express.Router();
const CancellationRequestController = require("../controllers/cancellationRequest.controller");
const AuthMiddleware = require("../middlewares/auth.middleware");

// User routes
router.post("/", AuthMiddleware.authenticate, CancellationRequestController.createCancellationRequest);

// Admin routes
router.get("/admin", AuthMiddleware.authenticate, AuthMiddleware.authorizeAdmin, CancellationRequestController.getAllCancellationRequests);
router.put("/:id/status", AuthMiddleware.authenticate, AuthMiddleware.authorizeAdmin, CancellationRequestController.updateCancellationRequestStatus);
router.post("/:id/refund", AuthMiddleware.authenticate, AuthMiddleware.authorizeAdmin, CancellationRequestController.processRefund);

module.exports = router;