export default function Homepage() {
  const basedUrl = import.meta.env.VITE_BASE_URL ?? 'http://localhost:3000';

  return (
    <div className="relative bg-[#27b5ae] text-white pb-40 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-full h-[280px] bg-white rounded-t-[50%] translate-y-20"></div>

      {/* MAIN CONTAINER */}
      <div className="container mx-auto px-8 pt-28 relative z-10">
        <div className="flex gap-12">
          {/* LEFT TEXT AREA */}
          <div className="w-1/2">
            <h1 className="text-6xl font-extrabold leading-tight">
              Việc
              <span className="text-orange-400"> Học Online</span> trở nên
              <br /> dễ dàng hơn
            </h1>

            <p className="mt-6 text-white/90 max-w-md text-lg">
              TKEDU là một nền tảng học tập tương tác giúp bạn học tập hiệu quả
              với công nghệ AI tiên tiến
            </p>

            <div className="mt-8 flex gap-4">
              <button className="bg-white text-[#27b5ae] px-8 py-3 rounded-full font-semibold shadow hover:bg-gray-100 transition">
                Tham gia ngay
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition">
                Tìm hiểu thêm
              </button>
            </div>
          </div>

          {/* RIGHT SIDE - FEATURES */}
          <div className="w-1/2 flex flex-col justify-center">
            <div className="space-y-6">
              <div className="flex gap-4 items-start bg-teal-900/30 border-l-4 border-orange-400 p-4 rounded-lg backdrop-blur-sm">
                <div className="text-3xl">🎓</div>
                <div>
                  <p className="font-semibold text-lg">Khóa học chất lượng</p>
                  <p className="text-white/80 text-sm">Học từ những chuyên gia tốt nhất</p>
                </div>
              </div>
              <div className="flex gap-4 items-start bg-teal-900/30 border-l-4 border-orange-400 p-4 rounded-lg backdrop-blur-sm">
                <div className="text-3xl">🤖</div>
                <div>
                  <p className="font-semibold text-lg">AI hỗ trợ học tập</p>
                  <p className="text-white/80 text-sm">Trợ lý AI cá nhân cho từng học viên</p>
                </div>
              </div>
              <div className="flex gap-4 items-start bg-teal-900/30 border-l-4 border-orange-400 p-4 rounded-lg backdrop-blur-sm">
                <div className="text-3xl">📊</div>
                <div>
                  <p className="font-semibold text-lg">Theo dõi tiến độ</p>
                  <p className="text-white/80 text-sm">Xem chi tiết hiệu quả học tập</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATS BOXES */}
      <div className="container mx-auto px-8 mt-20 relative z-10 flex gap-8 justify-center">
        {/* Box 1 */}
        <div className="bg-white text-gray-700 px-8 py-6 rounded-xl shadow-lg">
          <div className="text-4xl mb-2">👥</div>
          <p className="font-bold text-2xl">250K+</p>
          <p className="text-gray-500 text-sm">Học viên</p>
        </div>

        {/* Box 2 */}
        <div className="bg-white text-gray-700 px-8 py-6 rounded-xl shadow-lg">
          <div className="text-4xl mb-2">📚</div>
          <p className="font-bold text-2xl">500+</p>
          <p className="text-gray-500 text-sm">Khóa học</p>
        </div>

        {/* Box 3 */}
        <div className="bg-white text-gray-700 px-8 py-6 rounded-xl shadow-lg">
          <div className="text-4xl mb-2">⭐</div>
          <p className="font-bold text-2xl">4.9/5</p>
          <p className="text-gray-500 text-sm">Đánh giá</p>
        </div>
      </div>

      {/* DEBUG INFO */}
      <div className="container mx-auto px-8 mt-16 relative z-10">
        <div className="bg-gray-900/50 text-gray-300 p-4 rounded-lg text-center text-sm backdrop-blur-sm">
          Backend URL: <span className="font-mono text-orange-400">{basedUrl}</span>
        </div>
      </div>
    </div>
  );
}
