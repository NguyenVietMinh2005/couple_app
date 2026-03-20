import MatchQueue from '../models/MatchQueue.js';
import Couple from '../models/Couple.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';


export const joinQueue = async (req, res) => {
  try {
    // Nhờ có Middleware bảo vệ, chúng ta lấy thẳng ID từ thẻ VIP (req.user)
    const userId = req.user._id; 
    const { userGender, requestedGender } = req.body;

    if (!userGender || !requestedGender) {
      return res.status(400).json({ message: 'Vui lòng cung cấp giới tính của bạn và người muốn tìm!' });
    }

    // 1. Kiểm tra xem người này có đang "bắt cá hai tay" không
    const user = await User.findById(userId);
    if (user.coupleId) {
      return res.status(400).json({ message: 'Bạn đã có người yêu rồi, không được thả thính nữa!' });
    }

    // 2. Kiểm tra xem có đang xếp hàng sẵn không
    const existingQueue = await MatchQueue.findOne({ userId, status: 'Waiting' });
    if (existingQueue) {
      return res.status(400).json({ message: 'Bạn đang trong hàng đợi rồi. Kiên nhẫn nhé!' });
    }

    // 3. Đi tìm "Nửa kia" phù hợp trong hàng đợi
    const match = await MatchQueue.findOne({
      status: 'Waiting',
      userId: { $ne: userId }, // Không tự ghép đôi với chính mình
      // Logic khớp giới tính: Giới tính của họ phải bằng Giới tính mình tìm (hoặc mình tìm Any)
      userGender: requestedGender === 'Any' ? { $exists: true } : requestedGender,
      // Giới tính họ tìm phải bằng Giới tính của mình (hoặc họ tìm Any)
      requestedGender: userGender === 'Any' ? { $in: ['Male', 'Female', 'Any'] } : { $in: [userGender, 'Any'] }
    });

    // 4. NẾU TÌM THẤY -> Tác hợp ngay lập tức
    if (match) {
      // Đổi trạng thái hàng đợi của người kia
      match.status = 'Matched';
      await match.save();

      // Tạo Giấy chứng nhận (Couple)
      const newCouple = await Couple.create({
        users: [userId, match.userId],
        startDate: new Date(),
        status: 'Active'
      });

      // Cập nhật cho user hiện tại (Mình)
      user.coupleId = newCouple._id;
      user.isSingle = false;
      await user.save();

      // Cập nhật cho user kia (Đối tác)
      const partner = await User.findById(match.userId);
      partner.coupleId = newCouple._id;
      partner.isSingle = false;
      await partner.save();

      // --- CẤY CODE THÔNG BÁO VÀO ĐÂY ---
      // Báo cho mình
      await Notification.create({
        userId: userId,
        senderId: match.userId,
        type: 'system',
        content: 'Ting ting! Hệ thống đã ghép đôi bạn thành công 🎉',
      });
      // Báo cho đối tác
      await Notification.create({
        userId: match.userId,
        senderId: userId,
        type: 'system',
        content: 'Ting ting! Hệ thống đã ghép đôi bạn thành công 🎉',
      });
      // ----------------------------------

      return res.status(200).json({ 
        message: '🎉 Ting ting! Hệ thống đã tìm thấy nửa kia cho bạn!', 
        couple: newCouple 
      });
    }

    // 5. NẾU CHƯA TÌM THẤY -> Cho vào hàng đợi chờ người tiếp theo
    const newQueue = await MatchQueue.create({
      userId,
      userGender,
      requestedGender,
      status: 'Waiting'
    });

    res.status(201).json({ 
      message: '⏳ Đã vào hàng đợi. Hệ thống đang tìm người phù hợp...', 
      queue: newQueue 
    });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi Server', error: error.message });
  }
};