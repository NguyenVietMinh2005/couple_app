import express from "express";
import cors from 'cors';
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Couple from './models/Couple.js';
import MatchQueue from './models/MatchQueue.js';
import Message from './models/Message.js';
import Post from './models/Post.js';
import Story from './models/Story.js';
// import phan route
import authRoutes from './routes/authRoutes.js';
import coupleRoutes from './routes/coupleRoutes.js';
import postRoutes from './routes/postRoutes.js';
import storyRoutes from './routes/storyRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import userRoutes from './routes/userRoutes.js';
//import cua middle
import { notFound, errorHandler } from './middleware/errorMiddleware.js';


const app = express();
const server = http.createServer(app)
app.use(cors());
//Khởi tạo đường ống Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Cho phép mọi Frontend (Web/App) kết nối vào
  }
});

app.set('socketio', io);

app.use(express.json());


const initializeDatabase = async () => {
  await connectDB();

  try {
   
    await User.createCollection();
    await Couple.createCollection();
    await MatchQueue.createCollection();
    await Message.createCollection();
    await Post.createCollection();
    await Story.createCollection();
    
    console.log("Đã tạo sẵn tất cả các Bảng trong MongoDB!");
  } catch (error) {
    console.log("Bảng có thể đã tồn tại hoặc có lỗi:", error.message);
  }
};


initializeDatabase();

app.get("/api/test", (req, res) => {
  res.json({ message: "Server running" });
});

app.use('/api/couple', coupleRoutes);

// app.post("/api/user", async (req, res) => {

  
//   const { name, email, password } = req.body;

//   const user = new User({
//     name,
//     email,
//     password,
//   });

//   await user.save();
//   res.json(user);
// });

app.use('/api/auth', authRoutes);

app.use('/api/post', postRoutes);

app.use('/api/story', storyRoutes);

app.use('/api/message', messageRoutes);

app.use('/api/match', matchRoutes);

app.use('/api/upload', uploadRoutes);

app.use('/api/notifications', notificationRoutes);

app.use('/api/user', userRoutes);

app.use(notFound);
app.use(errorHandler);

// --- LẮNG NGHE SỰ KIỆN REAL-TIME ---
io.on("connection", (socket) => {
  console.log("⚡ Một thiết bị vừa kết nối Real-time:", socket.id);

// 1. Khi người dùng mở Chat, yêu cầu họ cung cấp ID cặp đôi để xếp phòng
  socket.on("join_room", (coupleId) => {
    socket.join(coupleId);
    console.log(`🚪 Một thiết bị vừa vào phòng tình yêu: ${coupleId}`);
  });

  // 2. Lắng nghe người dùng bấm Gửi tin nhắn
  socket.on("send_message", (data) => {
    // data gửi lên sẽ bao gồm: coupleId, content, senderId
    console.log("💌 Có tin nhắn mới:", data.content);

    // 3. Phát tin nhắn đó cho người kia trong cùng phòng (Bỏ qua người vừa gửi)
    socket.to(data.coupleId).emit("receive_message", data);
  });

  // 4. Lắng nghe khi một người bắt đầu gõ phím
  socket.on("typing", (coupleId) => {
    // Báo cho người còn lại trong phòng biết
    socket.to(coupleId).emit("partner_typing");
  });

  // 5. Lắng nghe khi người đó ngừng gõ (hoặc xóa hết chữ)
  socket.on("stop_typing", (coupleId) => {
    // Báo cho người còn lại tắt hiệu ứng đang gõ
    socket.to(coupleId).emit("partner_stop_typing");
  });

  socket.on("disconnect", () => {
    console.log("🔌 Thiết bị đã ngắt kết nối");
  });

  // Lắng nghe khi người dùng tắt app
  socket.on("disconnect", () => {
    console.log("🔌 Thiết bị đã ngắt kết nối:", socket.id);
  });

  // Tạo phòng cá nhân cho từng user để nhận thông báo đẩy
  socket.on("user_login", (userId) => {
    socket.join(userId.toString());
    console.log(`🔔 User ${userId} đã kết nối để nhận thông báo`);
  });
});

// 5. Quan trọng: Đổi app.listen thành server.listen
// Đổi app.listen thành server.listen và dùng PORT động của Render
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên port ${PORT} kèm Socket.io`);
});