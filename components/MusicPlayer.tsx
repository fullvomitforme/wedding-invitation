"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";
import { gsap } from "gsap";
import { useInvitation } from "@/components/InvitationContext";
import { getTemplateTheme } from "@/lib/template-themes";
import { defaultSongs } from "@/lib/music";

interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover?: string;
}

interface MusicPlayerProps {
  songs?: Song[];
  autoPlay?: boolean;
}

export default function MusicPlayer({ songs = [], autoPlay = false }: MusicPlayerProps) {
  const inv = useInvitation();
  const songsToUse = inv?.content?.music?.length ? inv.content.music : (songs.length ? songs : defaultSongs);
  const theme = getTemplateTheme(inv?.templateId);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  const currentSong = songsToUse[currentSongIndex] || null;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current && currentSong) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.error("Error playing audio:", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.url;
      if (isPlaying && autoPlay) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentSongIndex, currentSong]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % songsToUse.length);
  };

  const prevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + songsToUse.length) % songsToUse.length);
  };

  const selectSong = (index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("ended", nextSong);
      return () => {
        audioRef.current?.removeEventListener("ended", nextSong);
      };
    }
  }, [currentSongIndex]);

  useEffect(() => {
    if (playerRef.current) {
      gsap.from(playerRef.current, {
        y: 100,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.5,
      });
    }
  }, []);

  if (!currentSong) return null;

  return (
    <>
      <audio ref={audioRef} preload="auto" />
      
      <div
        ref={playerRef}
        className={`fixed bottom-6 right-6 z-50 ${theme.cardBg}/95 backdrop-blur-md rounded-2xl shadow-xl border ${theme.borderColor} overflow-hidden`}
      >
        {/* Main Player */}
        <div className="flex items-center gap-4 p-4 min-w-[320px]">
          {/* Album Cover / Icon */}
          <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} flex items-center justify-center flex-shrink-0`}>
            {currentSong.cover ? (
              <img
                src={currentSong.cover}
                alt={currentSong.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Music className="w-8 h-8 text-white" />
            )}
          </div>

          {/* Song Info */}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold ${theme.headingText} truncate`}>
              {currentSong.title}
            </p>
            <p className={`text-xs ${theme.mutedText} truncate`}>{currentSong.artist}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlayPause}
              className={`w-10 h-10 rounded-full ${theme.primaryBg} text-white flex items-center justify-center ${theme.primaryHover} transition-colors`}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleMute}
              className={`w-8 h-8 ${theme.bodyText} hover:opacity-80 transition-colors`}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>

            {songsToUse.length > 1 && (
              <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                className={`w-8 h-8 ${theme.bodyText} hover:opacity-80 transition-colors text-xs font-semibold`}
              >
                {songsToUse.length}
              </button>
            )}
          </div>
        </div>

        {/* Volume Slider */}
        <div className="px-4 pb-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: theme.primaryBg.includes('rose') ? '#f43f5e' : theme.primaryBg.includes('indigo') ? '#6366f1' : theme.primaryBg.includes('black') ? '#000000' : '#78716c' }}
          />
        </div>

        {/* Playlist */}
        {showPlaylist && songsToUse.length > 1 && (
          <div className={`border-t ${theme.borderColor} max-h-64 overflow-y-auto`}>
            {songsToUse.map((song, index) => (
              <button
                key={song.id}
                onClick={() => selectSong(index)}
                className={`w-full text-left px-4 py-3 hover:opacity-80 transition-colors ${
                  index === currentSongIndex ? theme.accentBg : ""
                }`}
              >
                <p className={`text-sm font-medium ${theme.headingText}`}>{song.title}</p>
                <p className={`text-xs ${theme.mutedText}`}>{song.artist}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
