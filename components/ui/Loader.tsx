import React from 'react';

interface LoaderProps {
    number?: number; // Number of bars
    size?: number; // Customizable size
    color?: string; // Customizable color
    className?: string; // Customizable className
}

const Loader: React.FC<LoaderProps> = ({
    number = 12,
    size = 20,
    color = 'bg-gray-500',
    className = '',
}) => {
    const bars = Array.from({ length: number }).map((_, index) => (
        <div
            key={index}
            className={`absolute top-1/2 h-[6px] w-[2px] ${color} rounded`}
            style={{
                transform: `rotate(${index * (360 / number)}deg) translate(0, 80%)`,
                animation: `fade ${number / 10}s infinite`,
                animationDelay: `${index * 0.1}s`,
                transformOrigin: '0 0',
            }}
        />
    ));

    return (
        <div
            className={`relative flex items-center justify-center ${className}`}
            style={{
                width: `${size}px`,
                height: `${size}px`,
            }}
        >
            {bars}
        </div>
    );
};

export default Loader;
