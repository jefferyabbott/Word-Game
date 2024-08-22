import { React } from 'react';

export default function KeyButton({letter, selectLetter, lettersAlreadyPlayed}) {
    
    function activeButtonPressed() {
        selectLetter(letter);
    }

    if (lettersAlreadyPlayed.includes(letter)) {
        return (
            <button className="bg-gray-500 text-white py-2 px-4 rounded-md m-2">{letter}</button>
        );
    } else {
        return (
            <button className="bg-blue-500 text-white py-2 px-4 rounded-md m-2" onClick={activeButtonPressed}>{letter}</button>
        );
    }
}