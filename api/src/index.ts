import express from "express";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import usersRouter from "./routes/users";
import authRouter from "./routes/auth";
import productsRouter from "./routes/products";
import categoriesRouter from "./routes/categories";
import reviewsRouter from "./routes/reviews";
import cartItemsRouter from "./routes/cartItems";
import ordersRouter from "./routes/orders";
import orderItemsRouter from "./routes/orderItems";
import adminRouter from "./routes/admin";
import designRequestsRouter from "./routes/designRequests";
import eventsRouter from "./routes/events";
import errorHandler from "./middlewares/errorHandler";

const app = express();
const port = env.PORT;
const allowedOrigins = env.FRONTEND_URL.split(",").map((origin) => origin.trim()).filter(Boolean);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later.",
  },
});

app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/v1", apiLimiter);
app.use("/api/v1/auth", authLimiter);

app.get("/", (_req, res) => {
  res.send("API running");
});

const apiV1Router = express.Router();
apiV1Router.use("/users", usersRouter);
apiV1Router.use("/auth", authRouter);
apiV1Router.use("/products", productsRouter);
apiV1Router.use("/categories", categoriesRouter);
apiV1Router.use("/reviews", reviewsRouter);
apiV1Router.use("/cart-items", cartItemsRouter);
apiV1Router.use("/orders", ordersRouter);
apiV1Router.use("/order-items", orderItemsRouter);
apiV1Router.use("/admin", adminRouter);
apiV1Router.use("/design-requests", designRequestsRouter);
apiV1Router.use("/events", eventsRouter);

app.use("/api/v1", apiV1Router);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
