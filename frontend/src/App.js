import { React, useState } from 'react';
import './App.css';
import Keyboard from './components/Keyboard';
import axios from 'axios';
import EndGameAnimation from './components/EndGameAnimation';

function App() {

  // dynamic styling:
  const guessesRemainingBoxTextGuesses = document.getElementById('guessesRemainingBoxTextGuesses');
  const guessesRemainingBoxTextNumber = document.getElementById('guessesRemainingBoxTextNumber');

  const [gameData, setGameData] = useState(null);
  const [lettersAlreadyPlayed, setLettersAlreadyPlayed] = useState([]);
  const [gameStatus, setGameStatus] = useState(null);

  // this array will make it easy to invalid keyboard when the user is out of turns
  const allLetters = ['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N','M'];

  function endFinalAnimation() {
    setGameStatus(null);
  }

  const newGame = async () => {
    // if there is existing game data. that means this is not the first play, 
    // se we can reset the guesses remaining styling
    if (gameData) {
      guessesRemainingBoxTextNumber.classList.remove('text-red-500');
      guessesRemainingBoxTextNumber.classList.add('text-blue-500');
      guessesRemainingBoxTextGuesses.classList.remove('text-red-500');
      guessesRemainingBoxTextGuesses.classList.add('text-white');
    }

    const { data } = await axios.post('/new');
    setGameData(data);
    setLettersAlreadyPlayed([]);
    setGameStatus('playing');

  };

  async function playGame(selectedLetter) {
    setLettersAlreadyPlayed([...lettersAlreadyPlayed, selectedLetter]);
    const guess = JSON.stringify({
      id: gameData.id,
      guess: selectedLetter
    });
    const { data } = await axios.post('/guess', guess);
    if (gameData.id === data.id) {
      
      if (data.guesses_remaining === 1) {
        guessesRemainingBoxTextNumber.classList.remove('text-blue-500');
        guessesRemainingBoxTextNumber.classList.add('text-red-500');
        guessesRemainingBoxTextGuesses.classList.remove('text-white');
        guessesRemainingBoxTextGuesses.classList.add('text-red-500');
        guessesRemainingBoxTextGuesses.innerHTML = "guess";
      }
      if (data.guesses_remaining === 0) {
        setLettersAlreadyPlayed(allLetters);
        setGameStatus('lose');
        guessesRemainingBoxTextGuesses.innerHTML = "guesses";
      }
      setGameData(data);
      if (!data.current.includes('_')) {
        setGameStatus('win');
        guessesRemainingBoxTextNumber.innerHTML = "0";
        guessesRemainingBoxTextGuesses.innerHTML = "guesses";
        setLettersAlreadyPlayed(allLetters);
      }
    }
    
  }

  return (
    <div className="bg-black flex justify-center h-screen">
    <main className="mt-12">
      <div className="flex-col">

      {/* title */}
      <h1 className="text-blue-500 text-7xl flex p-7">Word Game</h1>

      { gameStatus === 'win' && (
          <EndGameAnimation result="win" endFinalAnimation={endFinalAnimation}/>
        )
      }

      { gameStatus === 'lose' && (
        <EndGameAnimation result="lose" endFinalAnimation={endFinalAnimation}/>
      )}  

        <div className="min-h-80 bg-white text-black pb-2 rounded-lg">
        {gameData && (

          <div className="flex flex-col items-center">

         
          <div className="flex flex-row self-end">
            <div className="flex flex-col items-center bg-black p-2 m-1 rounded-lg w-20">
              <p className="text-5xl text-blue-500" id="guessesRemainingBoxTextNumber">{gameData.guesses_remaining}</p>
              <p className="text-white" id="guessesRemainingBoxTextGuesses">guesses</p>
            </div>
          </div>
         

            
            <p className="tracking-widest text-7xl mb-8">{gameData.current}</p>

            <Keyboard playGame={playGame} lettersAlreadyPlayed={lettersAlreadyPlayed}/>

            </div>
            )}
        </div>
            { !gameStatus && (
              <div className="flex justify-center">
                <button className="bg-blue-500 text-white py-2 px-4 mt-6 rounded-md" onClick={newGame}>New Game</button>
              </div>
            )}

            { gameStatus && gameStatus !== "playing" && (
              <div className="flex justify-center">
                <button className="bg-blue-500 text-white py-2 px-4 mt-6 rounded-md" onClick={newGame}>New Game</button>
              </div>
            )}
        
        
      </div>

    </main>
    </div>
  );
}

export default App;



