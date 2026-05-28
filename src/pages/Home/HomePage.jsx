// ============================================================
// FILE MẪU: src/pages/Home/HomePage.jsx
// THÀNH VIÊN 2 PHỤ TRÁCH TOÀN BỘ THƯ MỤC src/pages/Home/
// ============================================================
// Dựa vào trang mẫu này để xây dựng các trang còn lại.
// Mỗi trang là một Functional Component (arrow function).
// Sử dụng Tailwind CSS để style, không viết CSS thủ công.

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* TODO: Thay thế nội dung bên dưới bằng giao diện thực của Trang Chủ */}

      {/* GỢI Ý CẤU TRÚC TRANG CHỦ:
        1. <HeroBanner /> - Banner lớn với nền ảnh khách sạn + thanh tìm kiếm
        2. <FeaturedRooms /> - Section hiển thị 3-4 phòng nổi bật dạng card
        3. <WhyChooseUs /> - Section các ưu điểm / tiện nghi của khách sạn
        4. <Testimonials /> - Section đánh giá của khách hàng
      */}

      <section className="bg-gray-100 py-20 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Trang Chủ</h1>
        <p className="mt-4 text-gray-500">
          Thành viên 2 triển khai trang này trong thư mục <code>src/pages/Home/</code>
        </p>
        <a
          href="/search"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Tìm Phòng Ngay →
        </a>
      </section>
    </div>
  );
};

export default HomePage;
