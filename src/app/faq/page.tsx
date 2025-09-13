import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      question: "Is FINTOK free to use?",
      answer: "Yes, FINTOK is completely free to use. You can download unlimited videos from supported platforms without any cost or registration."
    },
    {
      question: "What video quality can I download?",
      answer: "We provide the highest quality available from the source platform. This typically ranges from 720p to 4K depending on the original video quality."
    },
    {
      question: "Do I need to install any software?",
      answer: "No, FINTOK is a web-based service. You can use it directly in your browser without installing any software or browser extensions."
    },
    {
      question: "Can I download private videos?",
      answer: "No, FINTOK can only download publicly available videos. We respect platform privacy settings and cannot access private or restricted content."
    },
    {
      question: "Why isn't my video downloading?",
      answer: "Common issues include: the video being private, age-restricted, or from an unsupported platform. Make sure the URL is correct and the video is publicly accessible."
    },
    {
      question: "Do you store my downloaded videos?",
      answer: "No, we don't store any videos on our servers. Videos are processed and delivered directly to your device without being saved on our end."
    },
    {
      question: "Is it legal to download videos?",
      answer: "Downloading videos for personal use is generally acceptable, but you should respect copyright laws and platform terms of service. Only download content you have permission to use."
    },
    {
      question: "How fast are the downloads?",
      answer: "Download speed depends on your internet connection and the video size. Our servers are optimized for fast processing, typically taking just a few seconds."
    },
    {
      question: "Can I download multiple videos at once?",
      answer: "Currently, you can download one video at a time. We're working on batch download features for future updates."
    },
    {
      question: "What formats are supported?",
      answer: "We primarily provide videos in MP4 format, which is compatible with all devices and media players. Audio-only downloads are available in MP3 format."
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
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600">
              Find answers to common questions about using FINTOK
            </p>
          </div>

          <div className="space-y-4 mb-12">
            {faqs.map((faq, index) => (
              <details key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 group">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                  <ChevronDown className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>

          <div className="text-center">
            <div className="bg-purple-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Still have questions?</h2>
              <p className="text-gray-600 mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}