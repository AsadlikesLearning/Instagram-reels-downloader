import Link from "next/link";
import { ArrowLeft, Copy, Play, Download } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Copy,
      title: "Copy the video link",
      description: "Find the video you want to download and copy its URL from the address bar or share button."
    },
    {
      icon: Play,
      title: "Paste it into FINTOK",
      description: "Return to FINTOK and paste the URL into our input field. We'll automatically detect the platform."
    },
    {
      icon: Download,
      title: "Download your video",
      description: "Click 'Start' and we'll process the video. Your download will begin automatically in the best available quality."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              How It Works
            </h1>
            <p className="text-lg text-gray-600">
              Download videos from any supported platform in just 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">High Quality Downloads</h4>
                  <p className="text-gray-600 text-sm">We fetch the highest quality version available from the source platform.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">No Watermarks</h4>
                  <p className="text-gray-600 text-sm">Download clean videos without platform watermarks when possible.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Fast Processing</h4>
                  <p className="text-gray-600 text-sm">Our servers process videos quickly for instant downloads.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">No Registration</h4>
                  <p className="text-gray-600 text-sm">Use FINTOK completely free without creating an account.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-purple-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Ready to get started?</h2>
              <p className="text-gray-600 mb-6">
                Try downloading your first video now - it's completely free!
              </p>
              <Link 
                href="/"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all"
              >
                Start Downloading
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}