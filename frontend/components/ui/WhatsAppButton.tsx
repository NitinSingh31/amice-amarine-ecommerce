'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '919876543210',
  defaultMessage = 'Hello Amice Amarine, I need assistance with sizing and products.',
}) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 select-none print:hidden">
      {/* Interactive Tooltip Card on Hover/Toggle */}
      <div
        className={`hidden sm:flex items-center gap-2 bg-linen-50/95 backdrop-blur-md border border-sage-200/90 text-sage-800 text-xs px-3.5 py-2 rounded-full shadow-lg transition-all duration-300 ${
          isTooltipOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
        }`}
      >
        <span className="font-medium">Need sizing or order assistance?</span>
        <span className="font-bold text-terracotta-600">Chat with us</span>
      </div>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsTooltipOpen(true)}
        onMouseLeave={() => setIsTooltipOpen(false)}
        className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
        aria-label="Chat with Amice Amarine on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:rotate-6" />

        {/* Pulse badge indicating live availability */}
        <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white" />
        </span>
      </a>
    </div>
  );
};
