"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, Download, Globe, HelpCircle, Info, Shield, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface MegaMenuProps {
  className?: string;
}

interface MenuItem {
  title: string;
  description: string;
  href: string;
  icon: string;
  featured?: boolean;
  comingSoon?: boolean;
}

export function MegaMenu({ className }: MegaMenuProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const menuItems: Array<{
    id: string;
    label: string;
    icon: any;
    items: MenuItem[];
  }> = [
    {
      id: "downloaders",
      label: "Downloaders",
      icon: Download,
      items: [
        {
          title: "Instagram Downloader",
          description: "Download Instagram videos, reels, and stories",
          href: "/",
          icon: "📸",
          featured: true,
        },
        {
          title: "TikTok Downloader",
          description: "Download TikTok videos without watermark",
          href: "/tiktok",
          icon: "🎵",
          comingSoon: true,
        },
        {
          title: "YouTube Downloader",
          description: "Download YouTube videos in HD quality",
          href: "/youtube",
          icon: "📺",
          comingSoon: true,
        },
        {
          title: "Facebook Downloader",
          description: "Download Facebook videos and reels",
          href: "/facebook",
          icon: "👥",
          comingSoon: true,
        },
      ],
    },
    {
      id: "features",
      label: "Features",
      icon: Star,
      items: [
        {
          title: "High Quality Downloads",
          description: "Get the best available resolution",
          href: "/supported",
          icon: "🎯",
        },
        {
          title: "Fast Processing",
          description: "Lightning quick video processing",
          href: "/how-it-works",
          icon: "⚡",
        },
        {
          title: "No Registration",
          description: "Download without creating an account",
          href: "/",
          icon: "🔓",
        },
        {
          title: "Mobile Friendly",
          description: "Works perfectly on all devices",
          href: "/",
          icon: "📱",
        },
      ],
    },
    {
      id: "support",
      label: "Support",
      icon: HelpCircle,
      items: [
        {
          title: "How It Works",
          description: "Learn how to download videos",
          href: "/how-it-works",
          icon: "❓",
        },
        {
          title: "FAQ",
          description: "Frequently asked questions",
          href: "/faq",
          icon: "💬",
        },
        {
          title: "Supported Platforms",
          description: "See all supported platforms",
          href: "/supported",
          icon: "✅",
        },
        {
          title: "Contact Us",
          description: "Get help and support",
          href: "/contact",
          icon: "📧",
          comingSoon: true,
        },
      ],
    },
    {
      id: "legal",
      label: "Legal",
      icon: Shield,
      items: [
        {
          title: "Privacy Policy",
          description: "How we protect your data",
          href: "/privacy-policy",
          icon: "🔒",
        },
        {
          title: "Terms of Service",
          description: "Terms and conditions",
          href: "/terms-of-service",
          icon: "📋",
        },
        {
          title: "DMCA Policy",
          description: "Copyright and DMCA information",
          href: "/dmca",
          icon: "⚖️",
          comingSoon: true,
        },
      ],
    },
  ];

  const handleMenuClick = (menuId: string) => {
    if (activeMenu === menuId) {
      setActiveMenu(null);
      setIsMenuOpen(false);
    } else {
      setActiveMenu(menuId);
      setIsMenuOpen(true);
    }
  };

  const handleMenuClose = () => {
    setActiveMenu(null);
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleMenuClose();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div ref={menuRef} className={cn("relative", className)}>
      {/* Desktop Mega Menu */}
      <div className="hidden lg:flex items-center space-x-8">
        {menuItems.map((menu) => (
          <div
            key={menu.id}
            className="relative group"
            onMouseEnter={() => setActiveMenu(menu.id)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <button 
              onClick={() => handleMenuClick(menu.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleMenuClick(menu.id);
                }
                if (e.key === 'Escape') {
                  handleMenuClose();
                }
              }}
              className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 rounded-md px-1 py-1"
              aria-expanded={activeMenu === menu.id}
              aria-haspopup="true"
            >
              <menu.icon className="h-4 w-4" />
              {menu.label}
              <ChevronDown className={cn(
                "h-3 w-3 transition-transform",
                activeMenu === menu.id && "rotate-180"
              )} />
            </button>

            {/* Mega Menu Dropdown */}
            {activeMenu === menu.id && (
              <div 
                className="absolute top-full left-0 mt-2 w-96 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 z-50 animate-in slide-in-from-top-2 duration-200"
                role="menu"
                aria-label={`${menu.label} submenu`}
              >
                <div className="grid grid-cols-1 gap-4">
                  {menu.items.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={handleMenuClose}
                      className={cn(
                        "group flex items-start gap-3 p-3 rounded-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer",
                        item.featured && "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800"
                      )}
                    >
                      <div className="text-2xl">{item.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {item.title}
                          </h3>
                          {item.featured && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full">
                              <Star className="h-3 w-3" />
                              Featured
                            </span>
                          )}
                          {item.comingSoon && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full">
                              <Zap className="h-3 w-3" />
                              Soon
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Mega Menu - Simplified */}
      <div className="lg:hidden">
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors px-2 py-1 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <Download className="h-4 w-4" />
            Download
          </Link>
          <Link
            href="/supported"
            className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors px-2 py-1 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <Globe className="h-4 w-4" />
            Platforms
          </Link>
          <Link
            href="/how-it-works"
            className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors px-2 py-1 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <Info className="h-4 w-4" />
            How it works
          </Link>
          <Link
            href="/faq"
            className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors px-2 py-1 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <HelpCircle className="h-4 w-4" />
            FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}
