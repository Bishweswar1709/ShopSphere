import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import { connect } from 'mongoose';
import { connectDB } from './lib/db.js';
import { connectRedis } from './lib/redis.js';
import cookieParser from 'cookie-parser';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import path from "path";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser()); 



// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

// Serve static files from the React frontend
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}


// Start the server
const startServer = async () => {
	try {
		await connectDB();
		await connectRedis();

		app.listen(PORT, () => {
			console.log(`✅ Server running on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error("❌ Server failed to start:", error.message);
		process.exit(1); // stop app if DB/Redis fails
	}
};

startServer();

