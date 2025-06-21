"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { useAudio } from '@/context/AudioContext';

const playlist = [
  { title: 'Black Box Korea', url: '/black-box-korea-9740.mp3' },
  { title: 'Black Box South Korea', url: '/black-box-south-korea-9498.mp3' },
  { title: 'Korean Love Dream', url: '/korean-love-dream-172770.mp3' }
];

export const AudioPlayer = () => {
  const { isPlaying, togglePlayPause } = useAudio();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);
  const volumeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => console.error("Playback failed:", error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const toNextTrack = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  }, []);

  const toPrevTrack = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.src = playlist[currentTrackIndex].url;
        audioRef.current.load();
        if (isPlaying) {
            audioRef.current.play().catch(error => console.error("Playback failed:", error));
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const newVolume = isMuted ? 0 : volume;
      audio.volume = newVolume;
      if (volumeRef.current) {
        volumeRef.current.value = String(newVolume);
      }
    }
  }, [volume, isMuted]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (isMuted && newVolume > 0) {
        setIsMuted(false);
    }
  };
  
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = parseFloat(e.target.value);
    }
  };

  const toggleMute = () => {
      setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if(audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if(progressRef.current) {
        progressRef.current.value = String(audioRef.current.currentTime);
      }
    }
  };

  const handleLoadedMetadata = () => {
      if(audioRef.current) {
        setDuration(audioRef.current.duration);
        if(progressRef.current) {
          progressRef.current.max = String(audioRef.current.duration);
        }
      }
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-lg flex items-center justify-between z-50">
      <audio 
        ref={audioRef}
        onEnded={toNextTrack}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        preload="metadata"
        muted={isMuted}
      />
      <div className="flex items-center space-x-4 w-1/3">
        <p className="font-semibold text-sm truncate">{playlist[currentTrackIndex].title}</p>
      </div>

      <div className="flex flex-col items-center space-y-2 w-1/3">
        <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toPrevTrack}><SkipBack className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" onClick={togglePlayPause}>
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={toNextTrack}><SkipForward className="h-5 w-5" /></Button>
        </div>
        <div className="flex items-center w-full max-w-xs space-x-2">
            <span className="text-xs">{formatTime(currentTime)}</span>
            <input
                ref={progressRef}
                type="range"
                min="0"
                step="1"
                value={currentTime}
                onChange={handleProgressChange}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer range-sm"
            />
            <span className="text-xs">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 w-1/3">
        <Button variant="ghost" size="icon" onClick={toggleMute}>
          {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
        <input
            ref={volumeRef}
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer range-sm"
        />
      </div>
    </div>
  );
}; 