import { InstagramVideoForm } from "@/features/instagram/components/form";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Header with Gradient */}
      <div className="bg-gradient-to-br from-fuchsia-600 via-pink-500 to-rose-500 text-white">
        {/* Header with branding */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold">FINTOK</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <span>Supported</span>
              <span>How it works</span>
              <span>FAQ</span>
              <button className="bg-white text-purple-600 px-4 py-2 rounded-full font-medium">
                Download App
              </button>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 py-16 sm:py-24 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Download videos from{" "}
              <span className="text-pink-200">anywhere</span>
            </h1>
            <p className="text-lg sm:text-xl text-pink-100 mb-12 max-w-2xl mx-auto">
              Paste a link from TikTok, Instagram, YouTube, Facebook, X and more. FINTOK
              fetches the best available media for fast, clean downloads.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          <InstagramVideoForm />
        </div>
      </div>
    </div>
  );
}
