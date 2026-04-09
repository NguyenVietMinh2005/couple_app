import 'package:flutter/material.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  // Giả lập ngày bắt đầu yêu (Sau này bạn sẽ lấy từ API Backend về)
  final DateTime _startDate = DateTime(2023, 10, 20); 

  // Hàm tính số ngày yêu nhau
  int _calculateDaysInLove() {
    final now = DateTime.now();
    final difference = now.difference(_startDate);
    return difference.inDays;
  }

  @override
  Widget build(BuildContext context) {
    final daysInLove = _calculateDaysInLove();

    return Scaffold(
      backgroundColor: const Color(0xFFFFF0F5), // Màu nền hồng nhạt lãng mạn
      body: CustomScrollView(
        slivers: [
          // --- PHẦN ẢNH BÌA (COVER PHOTO) ---
          SliverAppBar(
            expandedHeight: 250.0,
            floating: false,
            pinned: true,
            backgroundColor: const Color(0xFFFF4D6D),
            flexibleSpace: FlexibleSpaceBar(
              title: const Text(
                'Our Love Story',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  shadows: [Shadow(color: Colors.black45, blurRadius: 5)],
                ),
              ),
              background: Stack(
                fit: StackFit.expand,
                children: [
                  // Ảnh bìa (Dùng ảnh mạng tạm, sau này thay bằng link ảnh từ Backend)
                  Image.network(
                    'https://images.unsplash.com/photo-1518192161663-5a423636b04b?q=80&w=1000&auto=format&fit=crop',
                    fit: BoxFit.cover,
                  ),
                  // Lớp phủ tối mờ để dễ đọc chữ
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Colors.transparent, Colors.black.withOpacity(0.6)],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // --- PHẦN NỘI DUNG CHÍNH ---
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                children: [
                  const SizedBox(height: 20),
                  
                  // Khu vực Avatar đôi
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _buildAvatar('https://randomuser.me/api/portraits/men/32.jpg', 'Bạn nam'),
                      const SizedBox(width: 15),
                      // Trái tim đập ở giữa
                      const Icon(Icons.favorite, color: Color(0xFFFF4D6D), size: 40),
                      const SizedBox(width: 15),
                      _buildAvatar('https://randomuser.me/api/portraits/women/44.jpg', 'Bạn nữ'),
                    ],
                  ),
                  
                  const SizedBox(height: 40),

                  // Bộ đếm ngày yêu
                  Container(
                    padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.pink.withOpacity(0.1),
                          blurRadius: 20,
                          spreadRadius: 5,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        const Text(
                          'Đã bên nhau',
                          style: TextStyle(fontSize: 18, color: Color(0xFF666666)),
                        ),
                        const SizedBox(height: 10),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.baseline,
                          textBaseline: TextBaseline.alphabetic,
                          children: [
                            Text(
                              '$daysInLove',
                              style: const TextStyle(
                                fontSize: 60,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFFFF4D6D),
                              ),
                            ),
                            const SizedBox(width: 8),
                            const Text(
                              'Ngày',
                              style: TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFFFF4D6D),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 40),
                  
                  // Gợi ý tính năng đăng bài/Story (Tạm thời để giao diện)
                  Card(
                    elevation: 0,
                    color: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                    child: ListTile(
                      contentPadding: const EdgeInsets.all(15),
                      leading: CircleAvatar(
                        backgroundColor: const Color(0xFFFFF0F5),
                        child: Icon(Icons.add_a_photo, color: const Color(0xFFFF4D6D)),
                      ),
                      title: const Text('Lưu giữ khoảnh khắc hôm nay?', style: TextStyle(fontWeight: FontWeight.bold)),
                      subtitle: const Text('Thêm ảnh hoặc viết một dòng nhật ký...'),
                      onTap: () {
                        // TODO: Mở màn hình đăng bài/story
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Widget vẽ Avatar hình tròn có viền
  Widget _buildAvatar(String imageUrl, String name) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(3),
          decoration: const BoxDecoration(
            color: Color(0xFFFF4D6D), // Màu viền
            shape: BoxShape.circle,
          ),
          child: CircleAvatar(
            radius: 40,
            backgroundImage: NetworkImage(imageUrl),
            backgroundColor: Colors.grey[200],
          ),
        ),
        const SizedBox(height: 8),
        Text(
          name,
          style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF333333)),
        )
      ],
    );
  }
}