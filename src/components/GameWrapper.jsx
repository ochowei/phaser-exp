import React, { useState, useEffect } from 'react';

const DESIGN_WIDTH = 800;
const DESIGN_HEIGHT = 600;

export default function GameWrapper({ children }) {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const onResize = () => {
            const s = Math.min(
                window.innerWidth / DESIGN_WIDTH,
                window.innerHeight / DESIGN_HEIGHT
            );
            setScale(s);
        };
        onResize();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return (
        <div style={{
            width: '100vw',
            height: '100dvh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
        }}>
            <div style={{
                width: DESIGN_WIDTH,
                height: DESIGN_HEIGHT,
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
                willChange: 'transform',
            }}>
                {children}
            </div>
        </div>
    );
}
