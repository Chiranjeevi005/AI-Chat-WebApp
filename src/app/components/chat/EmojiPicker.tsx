'use client';

import { useState, useRef, useEffect } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

export default function EmojiPicker({ onEmojiSelect, onClose }: EmojiPickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div ref={pickerRef} className="absolute bottom-16 right-4 z-50">
      <Picker 
        data={data} 
        onEmojiSelect={(emoji: any) => onEmojiSelect(emoji.native)}
        theme="dark"
        skinTonePosition="none"
        previewPosition="none"
        searchPosition="none"
        perLine={8}
        emojiButtonSize={24}
        emojiSize={16}
      />
    </div>
  );
}