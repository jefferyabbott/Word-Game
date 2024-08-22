import { React } from 'react';
import KeyButton from './KeyButton';

export default function Keyboard({playGame, lettersAlreadyPlayed}) {

    const topRowLetters = ['Q','W','E','R','T','Y','U','I','O','P'];
    const middleRowLetters = ['A','S','D','F','G','H','J','K','L'];
    const bottomRowLetters = ['Z','X','C','V','B','N','M'];

    const selectLetter = (letter) => {
        playGame(letter);
    }

    return (
        <div className="flex-col align-center">
            <div className="flex flex-row justify-center">
                {
                    topRowLetters.map((letter) => (<KeyButton letter={letter} selectLetter={selectLetter} lettersAlreadyPlayed={lettersAlreadyPlayed} key={letter}></KeyButton>))
                }
            </div>
            <div className="flex flex-row justify-center">
                {
                    middleRowLetters.map((letter) => (<KeyButton letter={letter} selectLetter={selectLetter} lettersAlreadyPlayed={lettersAlreadyPlayed} key={letter}></KeyButton>))
                }
            </div>
            <div className="flex flex-row justify-center">
                {
                    bottomRowLetters.map((letter) => (<KeyButton letter={letter} selectLetter={selectLetter} lettersAlreadyPlayed={lettersAlreadyPlayed} key={letter}></KeyButton>))
                }
            </div>
            
        </div>
    )
}