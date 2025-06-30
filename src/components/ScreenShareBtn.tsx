import React, { useState } from 'react';
import { Monitor, MonitorOff } from 'lucide-react';

interface ScreenShareBtnProps {
  isSharing: boolean;
  onStartShare: () => void;
  onStopShare: () => void;
  disabled?: boolean;
}

export const ScreenShareBtn: React.FC<ScreenShareBtnProps> = ({
  isSharing,
  onStartShare,
  onStopShare,
  disabled = false
}) => {
  return (
    <button
      onClick={isSharing ? onStopShare : onStartShare}
      disabled={disabled}
      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
        isSharing
          ? 'bg-red-600 text-white hover:bg-red-700'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isSharing ? (
        <>
          <MonitorOff className="h-4 w-4" />
          <span>Stop Sharing</span>
        </>
      ) : (
        <>
          <Monitor className="h-4 w-4" />
          <span>Share Screen</span>
        </>
      )}
    </button>
  );
};