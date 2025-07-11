import React from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface NotificationBarProps {
  message?: string;
}

const NotificationBar: React.FC<NotificationBarProps> = ({ 
  message = "Notice !!! Shawon got cgpa -4 in semester 4-1" 
}) => {
  const handleNotificationClick = (): void => {
    console.log('Notification clicked');
  };

  return (
    <div className="bg-gray-200 px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-300 transition-colors">
      <span className="text-gray-700 text-sm">
        {message}
      </span>
      <button onClick={handleNotificationClick}>
        <ChevronRightIcon className="h-4 w-4 text-gray-600" />
      </button>
    </div>
  );
};

export default NotificationBar;