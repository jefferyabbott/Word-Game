import { React, useState, useEffect } from 'react';

export default function EndGameAnimation({result, endFinalAnimation}) {

    const winningEmoji = ['🎉', '🙌', '🥳', 'winner', '👏', '🤯', '🤩', 'YOU WIN!!!', '🎉', '🙌', '🥳', 'winner', '👏', '🤯', '🤩', 'YOU WIN!!!'];
    const losingEmoji = ['👎', '😞', '💩', 'game over', '😢', '🫣', '🤬', 'game over', '👎', '😞', '💩', 'game over', '😢', '🫣', '🤬', 'game over'];

    const characters = (result === 'win') ? winningEmoji : losingEmoji;
    const [positions, setPositions] = useState(characters.map(() => ({ top: 0, left: 0 })));

    const [isAnimating, setIsAnimating] = useState(true);

    useEffect(() => {
      const interval = setInterval(() => {
        if (isAnimating) {
          setPositions((prevPositions) =>
            prevPositions.map(() => ({
              top: Math.random() * window.innerHeight,
              left: Math.random() * window.innerWidth,
            }))
          );
        }
      }, 1000); // Change position every second
  
      const timeout = setTimeout(() => {
        setIsAnimating(false);
        clearInterval(interval);
      }, 8000); // Stop after 8 seconds
  
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }, [isAnimating]);

    if (!isAnimating) {
      endFinalAnimation();
    }
   
      return (
        <div className="relative w-full h-screen text-8xl text-white">
          {characters.map((char, index) => (
            <div key={index} className="absolute transition-all duration-1000 ease-in-out" style={{
                top: positions[index].top,
                left: positions[index].left,
              }}
            >
              {char}
            </div>
          ))}
        </div>
      );
}