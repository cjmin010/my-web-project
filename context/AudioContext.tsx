"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  togglePlayPause: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  return (
    <AudioContext.Provider value={{ isPlaying, togglePlayPause }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}; 