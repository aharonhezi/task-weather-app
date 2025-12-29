import React from 'react';

interface WeatherDisplayProps {
  icon?: string;
  temperature: number;
}

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ icon, temperature }) => (
  <span>
    {icon && (
      <img 
        src={icon.startsWith('//') ? `https:${icon}` : icon}
        alt="Weather"
        style={{ width: '20px', height: '20px', verticalAlign: 'middle', marginRight: '4px' }}
      />
    )}
    {temperature}°C
  </span>
);

