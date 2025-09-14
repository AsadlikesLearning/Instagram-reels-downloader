"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSounds } from "@/lib/sounds";

export function SoundToggle() {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const { setSoundEnabled } = useSounds();

  useEffect(() => {
    // Load sound preference from localStorage
    const savedPreference = localStorage.getItem('soundEnabled');
    if (savedPreference !== null) {
      const enabled = savedPreference === 'true';
      setIsSoundEnabled(enabled);
      setSoundEnabled(enabled);
    }
  }, [setSoundEnabled]);

  const toggleSound = () => {
    const newState = !isSoundEnabled;
    setIsSoundEnabled(newState);
    setSoundEnabled(newState);
    localStorage.setItem('soundEnabled', newState.toString());
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSound}
      className="h-8 w-8 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      title={isSoundEnabled ? "Disable sounds" : "Enable sounds"}
    >
      {isSoundEnabled ? (
        <Volume2 className="h-4 w-4" />
      ) : (
        <VolumeX className="h-4 w-4" />
      )}
    </Button>
  );
}
