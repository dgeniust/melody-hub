import React from "react";
import {
  ArrowRight,
  Check,
  X,
  ShieldAlert,
  Sparkles,
  Heart,
} from "lucide-react";

const LicensePage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-peach-paper font-manrope text-charcoal-ink p-4 md:p-6 lg:p-10 flex flex-col justify-between select-none relative overflow-x-hidden">
      {/* CRAYON DOODLES DECORATION (Floating Line-Art Vibe) */}
      <div className="absolute top-44 left-6 text-4xl opacity-20 rotate-[-15deg] pointer-events-none font-alfa">
        📄
      </div>
      <div className="absolute bottom-28 right-8 text-5xl opacity-15 rotate-[20deg] pointer-events-none">
        ⚖️
      </div>

      {/* HEADER SECTION (Pill Navigation & Breadcrumbs) */}
      <header className="w-full max-w-[1200px] mx-auto flex flex-row justify-between items-center pb-6 border-b-2 border-charcoal-ink border-dashed">
        <div className="flex flex-row items-center gap-2">
          <span className="font-alfa text-lg lg:text-xl tracking-wide">
            Nam Design
          </span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
          <span className="bg-powder-blue px-3 py-1 border-2 border-charcoal-ink rounded-lpalo text-xs font-black uppercase tracking-wider">
            License & Terms
          </span>
        </div>

        <span className="text-sm font-bold underline cursor-pointer hover:text-ember-orange transition-colors">
          @dgeniust
        </span>
      </header>

      {/* MAIN CONTENT SPLIT LAYOUT */}
      <main className="w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row items-start gap-10 lg:gap-16 py-10 lg:py-14 flex-1">
        {/* LEFT COLUMN: HERO TITLES & LICENSING DETAILS */}
        <div className="flex-1 w-full flex flex-col gap-8">
          {/* BIG SHOUTING HEADLINE SECTION */}
          <div className="space-y-3">
            <h1 className="font-alfa text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.09] text-left">
              License Agreement & Terms of use
              <span className="text-ember-orange">.</span>
            </h1>
            <p className="text-base md:text-lg font-bold text-gray-600">
              Vui lòng dành một ít thời gian để đọc kỹ các điều khoản sử dụng
              tài nguyên của chúng tôi.
            </p>
          </div>

          {/* DETAILED PERMISSIONS CONTAINER */}
          <div className="bg-snow border-2 border-charcoal-ink rounded-lpalo p-6 md:p-8 space-y-6">
            <div className="flex flex-col justify-center items-start gap-1 border-b-2 border-charcoal-ink border-dashed pb-4">
              <h2 className="font-alfa text-xl md:text-2xl tracking-tight flex items-center gap-2">
                Quy định bản quyền
                <Sparkles className="w-5 h-5 text-sunbeam-yellow fill-current stroke-charcoal-ink stroke-[1.5]" />
              </h2>
              <p className="text-sm font-medium text-gray-500">
                Bản cấp phép tiêu chuẩn này cho phép bạn thực hiện các quyền hạn
                sau:
              </p>
            </div>

            {/* GRIDS: YOU CAN VS YOU CAN'T */}
            <div className="flex flex-col gap-6">
              {/* SECTION: YOU CAN (Được phép làm) */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 font-alfa text-base md:text-lg text-charcoal-ink">
                  <span>Bạn có thể</span>
                  <span>👇</span>
                </div>

                <div className="space-y-3.5">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-lime-zest border-2 border-charcoal-ink rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[4]" />
                    </div>
                    <p className="text-sm md:text-base font-semibold text-gray-700 leading-relaxed">
                      Sử dụng gói tài nguyên này cho bất kỳ dự án cá nhân hoặc
                      mục đích thương mại của khách hàng.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-lime-zest border-2 border-charcoal-ink rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[4]" />
                    </div>
                    <p className="text-sm md:text-base font-semibold text-gray-700 leading-relaxed">
                      Tái chế và chỉnh sửa bản thiết kế này phục vụ cho truyền
                      thông đa phương tiện, bài thuyết trình hoặc sản xuất
                      video.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION: YOU CAN'T (Không được phép làm) */}
              <div className="space-y-3 pt-4 border-t-2 border-charcoal-ink border-dashed">
                <div className="flex items-center gap-1.5 font-alfa text-base md:text-lg text-charcoal-ink">
                  <span>Bạn KHÔNG THỂ</span>
                  <span>👇</span>
                </div>

                <div className="space-y-3.5">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-ember-orange text-snow border-2 border-charcoal-ink rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3.5 h-3.5 stroke-[4]" />
                    </div>
                    <p className="text-sm md:text-base font-semibold text-gray-700 leading-relaxed">
                      Rao bán, sang nhượng hoặc phân phối lại bộ công cụ (Kit)
                      này trên bất kỳ nền tảng Marketplace thương mại điện tử
                      nào.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-ember-orange text-snow border-2 border-charcoal-ink rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3.5 h-3.5 stroke-[4]" />
                    </div>
                    <p className="text-sm md:text-base font-semibold text-gray-700 leading-relaxed">
                      Tích hợp mã nguồn/giao diện này để tạo thành các gói sản
                      phẩm UI KIT trả phí khác.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RECONFIGURED SCRAPBOOK CONTAINER (Tilted Card) */}
        <div className="w-full lg:w-[440px] shrink-0 flex items-center justify-center relative self-center lg:self-start">
          {/* Lớp nền phẳng đổ màu lệch sau lưng */}
          <div className="absolute inset-0 bg-lilac-tint border-2 border-charcoal-ink rounded-lpalo translate-x-3 translate-y-3 pointer-events-none" />

          {/* Card chứa hình ảnh minh họa bọc viền dày */}
          <div className="w-full bg-snow border-2 border-charcoal-ink rounded-lpalo p-6 rotate-[1deg] z-10 flex flex-col items-center">
            <div className="w-full aspect-square bg-mint-wash border-2 border-charcoal-ink rounded-lpalo overflow-hidden relative p-4 flex items-center justify-center">
              {/* Thẻ Image chính */}
              <img
                src="Saly-10.png"
                alt="License Illustration"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

              {/* Graphic khuyết danh phòng khi thiếu file ảnh */}
              <ShieldAlert className="w-20 h-20 text-charcoal-ink/10 stroke-[1.5] absolute pointer-events-none" />
            </div>

            <div className="w-full mt-4 flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-gray-400">
              <span>Bảo hộ pháp lý</span>
              <span>Mã điều khoản v1.0</span>
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

export default LicensePage;
