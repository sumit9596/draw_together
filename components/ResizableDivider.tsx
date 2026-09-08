// Lets users resize adjacent workspace panels without coupling their layout logic.
"use client";
import React, { useState, useRef, useEffect } from 'react';

interface ResizableDividerProps {
    leftChild: React.ReactNode;
    rightChild: React.ReactNode;
    initialLeftPercent?: number;
}

export default function ResizableDivider({
    leftChild,
    rightChild,
    initialLeftPercent = 50,
}: ResizableDividerProps) {
    const [leftPercent, setLeftPercent] = useState(initialLeftPercent);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;

            const container = containerRef.current;
            const containerRect = container.getBoundingClientRect();
            const newLeftPercent = ((e.clientX - containerRect.left) / containerRect.width) * 100;

            // Constrain between 20% and 80%
            const constrainedPercent = Math.max(20, Math.min(80, newLeftPercent));
            setLeftPercent(constrainedPercent);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div
            ref={containerRef}
            className="flex w-full h-full overflow-hidden"
        >
            {/* Left Panel */}
            <div style={{ width: `${leftPercent}%` }} className="overflow-auto">
                {leftChild}
            </div>

            {/* Draggable Divider */}
            <div
                onMouseDown={() => setIsDragging(true)}
                className={`w-1 bg-gray-300 hover:bg-red-500 cursor-col-resize transition-colors ${isDragging ? 'bg-red-500' : ''
                    }`}
                title="Drag to resize"
            />

            {/* Right Panel */}
            <div style={{ width: `${100 - leftPercent}%` }} className="overflow-auto">
                {rightChild}
            </div>
        </div>
    );
}
