import React from "react";
import { ArrowRight, Coffee, Heart, Sparkles } from "lucide-react";

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-peach-paper font-manrope text-charcoal-ink p-4 md:p-6 lg:p-10 flex flex-col justify-between select-none relative overflow-x-hidden">
      {/* CRAYON DOODLES DECORATION (Floating Line-Art Atmosphere) */}
      <div className="absolute top-32 left-8 text-4xl opacity-20 rotate-[-12deg] pointer-events-none font-alfa">
        🎨
      </div>
      <div className="absolute bottom-24 right-12 text-5xl opacity-20 rotate-[15deg] pointer-events-none">
        ✨
      </div>
      <div className="absolute top-1/2 right-1/3 text-4xl opacity-10 rotate-[45deg] pointer-events-none">
        🚀
      </div>

      {/* HEADER SECTION (Pill Navigation Inspired) */}
      <header className="w-full max-w-[1200px] mx-auto flex flex-row justify-between items-center pb-6 border-b-2 border-charcoal-ink border-dashed">
        <div className="flex flex-row items-center gap-2">
          <span className="font-alfa text-lg lg:text-xl tracking-wide">
            MelodyHub
          </span>
          <ArrowRight className="w-4 h-4 stroke-[3] text-charcoal-ink" />
          <span className="bg-sunbeam-yellow px-3 py-1 border-2 border-charcoal-ink rounded-lpalo text-xs font-extrabold uppercase tracking-wider">
            About Me
          </span>
        </div>

        <a
          href="https://github.com/your-username"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-snow border-2 border-charcoal-ink rounded-lpalo font-bold text-xs hover:bg-mint-wash transition-colors active:scale-95"
        >
          {/* <Github className="w-4 h-4" /> */}
          <span>@dgeniust</span>
        </a>
      </header>

      {/* MAIN CONTENT CONTENT CONTAINER (Responsive Split Layout) */}
      <main className="w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 py-10 lg:py-14 flex-1">
        {/* LEFT COLUMN: INTRO & SUPPORT */}
        <div className="flex-1 w-full flex flex-col gap-8">
          {/* SECTION 1: SHOUTING HEADLINE CARD */}
          <div className="bg-snow border-2 border-charcoal-ink rounded-lpalo p-6 md:p-8 relative">
            <span className="absolute -top-3 left-6 bg-ember-orange text-snow border-2 border-charcoal-ink rounded-lpalo-sm text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5">
              Xin chào!
            </span>
            <h1 className="font-alfa text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.09] text-left mb-4">
              Mình là Đạt<span className="text-magenta-pop">.</span>
            </h1>
            <p className="text-base md:text-lg font-medium text-gray-800 leading-[1.6]">
              Hiện đang là lập trình viên Full-stack tại{" "}
              <span className="underline decoration-2 decoration-ember-orange font-bold">
                MelodyHub
              </span>
              . Mình đã làm việc trong ngành hơn 4 năm qua. Hy vọng các tài
              nguyên âm nhạc và mã nguồn thủ công này có thể giúp ích cho quá
              trình thiết kế cũng như phát triển sản phẩm của bạn. Cheers!
            </p>
          </div>

          {/* SECTION 2: WAYS TO SUPPORT ME CARD */}
          <div className="bg-snow border-2 border-charcoal-ink rounded-lpalo p-6 md:p-8">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-alfa text-xl md:text-2xl tracking-tight">
                Đồng hành cùng tụi mình
              </h2>
              <Sparkles className="w-5 h-5 text-ember-orange fill-current" />
            </div>
            <p className="text-sm font-bold text-gray-600 mb-6">
              Nếu bạn yêu thích các nội dung và sản phẩm của mình, hãy cân nhắc
              ủng hộ mình qua phương thức bên dưới nhé:
            </p>

            {/* Buy Me A Coffee Box (Neo-brutalist Tilted Flat Style) */}
            <div className="p-4 bg-powder-blue border-2 border-charcoal-ink rounded-lpalo flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-snow border-2 border-charcoal-ink rounded-full flex items-center justify-center shrink-0">
                  <Coffee className="w-6 h-6 text-charcoal-ink stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-alfa text-lg tracking-tight">
                    Buy Me A Coffee 👇
                  </h3>
                  <a
                    href="https://www.buymeacoffee.com/dgeniust"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono font-bold underline text-charcoal-ink/80 hover:text-charcoal-ink block truncate max-w-[240px] sm:max-w-xs mt-0.5"
                  >
                    buymeacoffee.com/dgeniust
                  </a>
                </div>
              </div>

              <a
                href="https://www.buymeacoffee.com/dgeniust"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 bg-sunbeam-yellow border-2 border-charcoal-ink rounded-lpalo text-xs font-black uppercase text-center tracking-wider active:translate-y-0.5 transition-transform"
              >
                Tặng Cafe ☕
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SCRAPBOOK ILLUSTRATION (Tilted Content Card Effect) */}
        <div className="w-full lg:w-[460px] shrink-0 flex items-center justify-center relative">
          {/* Lớp nền đổ màu lệch góc phía sau tạo hiệu ứng scrapbook */}
          <div className="absolute inset-0 bg-mint-wash border-2 border-charcoal-ink rounded-lpalo translate-x-3 translate-y-3 pointer-events-none" />

          {/* Card chứa ảnh minh họa chính xoay nhẹ */}
          <div className="w-full bg-snow border-2 border-charcoal-ink rounded-lpalo p-6 rotate-[-1.5deg] z-10 flex flex-col items-center">
            <div className="w-full aspect-square bg-lilac-tint border-2 border-charcoal-ink rounded-lpalo overflow-hidden relative p-4 flex items-center justify-center">
              {/* Vùng nạp ảnh lớn Saly 39 hoặc Logo */}
              <img
                src="untitled566.png"
                alt="Dat Illustration"
                className="w-full h-full object-contain filter drop-shadow-[0_0_0_#000000]"
                onError={(e) => {
                  // Fallback hiển thị đồ họa dạng hình khối nếu thiếu asset ảnh
                  e.currentTarget.style.display = "none";
                }}
              />

              {/* Ký hiệu thô mộc làm background trống */}
              <div className="absolute text-8xl font-alfa text-charcoal-ink/5 select-none pointer-events-none">
                MelodyHub
              </div>
            </div>

            <div className="w-full mt-4 flex items-center justify-between text-xs font-black uppercase tracking-wider text-gray-500">
              <span>Mã Studio: #4002</span>
              <span>Based in Vietnam</span>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER SECTION */}
      <footer className="w-full max-w-[1200px] mx-auto text-center lg:text-left pt-6 border-t-2 border-charcoal-ink border-dashed flex flex-row items-center justify-center lg:justify-start gap-2 text-xs font-extrabold text-gray-600 uppercase tracking-wider">
        <span>Created with</span>
        <Heart className="w-3.5 h-3.5 fill-ember-orange text-ember-orange" />
        <span>by dgeniust Design — Powered by MelodyHub</span>
      </footer>
    </div>
  );
};

export default AboutUs;
