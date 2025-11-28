export default function Homepage() {
  return (
    <div className="relative bg-[#27b5ae] text-white pb-40 overflow-hidden">
      {/* Background cong */}
      <div className="absolute bottom-0 left-0 w-full h-[280px] bg-white rounded-t-[50%] translate-y-20"></div>

      {/* MAIN CONTAINER */}
      <div className="container mx-auto px-8 pt-28 relative z-10 flex">
        {/* LEFT TEXT AREA */}
        <div className="w-1/2">
          <h1 className="text-6xl font-extrabold leading-tight">
            <span className="text-orange-400">Studying</span> Online is now
            <br /> much easier
          </h1>

          <p className="mt-6 text-white/90 max-w-md">
            TKEDU is an interactive platform that will teach you
            <br /> in a more interactive way
          </p>

          <button className="mt-8 bg-white text-[#27b5ae] px-8 py-3 rounded-full font-semibold shadow hover:bg-gray-100">
            Join Now
          </button>
        </div>

        {/* RIGHT IMAGE PLACEHOLDER */}
        <div className="w-1/2 flex justify-center">
          <div className="w-[340px] h-[280px] bg-white/60 rounded-2xl shadow"></div>
        </div>
      </div>

      {/* FLOATING BOXES */}
      {/* Box 1 */}
      <div className="absolute left-[45%] top-[48%] bg-white text-gray-700 px-6 py-3 rounded-xl shadow flex items-center gap-3">
        <div className="text-3xl">📅</div>
        <div>
          <p className="font-bold text-lg">250k</p>
          <p className="text-sm text-gray-500">Assisted Student</p>
        </div>
      </div>

      {/* Box 2 */}
      <div className="absolute right-[18%] top-[44%] bg-white px-4 py-3 shadow rounded-xl">
        <div className="text-3xl">📊</div>
      </div>

      {/* Box 3 */}
      <div className="absolute left-[55%] top-[63%] bg-white px-6 py-3 rounded-xl shadow flex items-center gap-3">
        <div className="text-3xl">✉️</div>
        <div>
          <p className="font-semibold">Congratulations</p>
          <p className="text-gray-500 text-sm">Your admission completed</p>
        </div>
      </div>
    </div>
  );
}
