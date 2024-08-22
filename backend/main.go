package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"regexp"
	"strings"

	"github.com/gorilla/mux"
)

const (
	serverAddress = "localhost:1337"
)

// this slice will hold all the games
var games []Game

// new Game - this is where the /new route goes
func newGame(words []string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		// generate a unique game identifier
		uuid, err := generateIdentifier()
		if err != nil {
			log.Fatal("Error generating unique ID: ", err)

			// blimey!
			// send an error to indicate that creating the new game failed
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		// select a random word
		targetWord := words[rand.Intn(len(words))]

		// create new game object
		var lettersGuessed = []string{}
		newGame := Game{ID: uuid, GuessesRemaining: 6, Current: strings.Repeat("_", len(targetWord)), TargetWord: targetWord, LettersGuessed: lettersGuessed}

		// add the new game to the games slice
		games = append(games, newGame)

		// generate http response
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(newGame)
	}
}

// guess - this is where the guess route goes
func guess(w http.ResponseWriter, r *http.Request) {
	var guess Guess
	_ = json.NewDecoder(r.Body).Decode(&guess)

	// confirm that only 1 character was sent
	if len(guess.Guess) > 1 {
		// blimey!
		// send an error to indicate that the guess is not valid
		// too many letters (characters) were sent
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// check if guess is A-Z only
	validLetter, err := regexp.MatchString("[A-Z]", guess.Guess)

	// um, wut?  Just in case my regex fails, since I guess err is
	// a possible return value.
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if !validLetter {
		// blimey!
		// send an error to indicate that the guess is not valid
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// look for the game identifier to find its index
	index := lookupGame(guess.ID)

	if index == -1 {
		// blimey!
		// send an error to indicate that game id doesn't exist
		w.WriteHeader(http.StatusNotFound)
		return
	}

	// generate http response
	w.Header().Set("Content-Type", "application/json")

	// check if the game is still playable

	// check if the game was already won, if so, just
	// return the game object as-is
	if !strings.Contains(games[index].Current, "_") {
		json.NewEncoder(w).Encode(games[index])
		return
	}

	// check if the user has guesses remaining
	// if the game is already over, just return the game object as-is
	if games[index].GuessesRemaining == 0 {
		json.NewEncoder(w).Encode(games[index])
		return
	}

	// check if the letter has already been guessed,
	// if so, return the game object as-is
	for _, letters := range games[index].LettersGuessed {
		if string(letters) == guess.Guess {
			json.NewEncoder(w).Encode(games[index])
			return
		}
	}
	// add played letter to the letters guessed slice
	games[index].LettersGuessed = append(games[index].LettersGuessed, guess.Guess)

	// find any indexes where the guessed letter appears in the target word
	letterFoundInWord := false
	var foundIndices []int
	for targetLetterIndex, letter := range games[index].TargetWord {
		if string(letter) == guess.Guess {
			foundIndices = append(foundIndices, targetLetterIndex)
			letterFoundInWord = true
		}
	}

	// letter was found in the word, so decrement the guesses remaining
	if !letterFoundInWord {
		games[index].GuessesRemaining = games[index].GuessesRemaining - 1
	}

	for _, targetIndex := range foundIndices {
		games[index].Current = games[index].Current[:targetIndex] + guess.Guess + games[index].Current[targetIndex+1:]
	}

	// return updated game
	json.NewEncoder(w).Encode(games[index])

}

// helper function to find index of the active game
func lookupGame(requestedID string) int {
	for index, game := range games {
		if game.ID == requestedID {
			return index
		}
	}
	return -1
}

func main() {
	// deprecated and no longer necessary:
	// rand.Seed(time.Now().UnixNano())

	router := mux.NewRouter()

	words, err := loadWords("words.txt")
	if err != nil {
		log.Fatal(err)
		fmt.Println("Unable to read words.txt file, exiting!")
		os.Exit(1)
	}

	// NEW GAME
	router.HandleFunc("/new", newGame(words)).Methods("POST")

	// GUESS LETTER
	router.HandleFunc("/guess", guess).Methods("POST")

	log.Printf("Starting server on http://%s", serverAddress)
	if err := http.ListenAndServe(serverAddress, router); err != nil {
		log.Fatal(err)
	}
}

// The only tradeoffs I can think of at the moment...
//
// 1) I chose to use MUX since I have limited time. I guess this is OK,
// but MUX is an open source project that is no longer maintained. If
// I were creating a real production server, I think I would take a few
// more minutes to explore other options.
//
// 2) I did not write any unit tests. I am fairly new to Go, most of my
// backend experience is in Node.js and some Java/Spring, but not Go (yet),
// I know the basics of writing Go tests, but I'm not confident enough
// to write tests of an API endpoint in Go. If I had more time (a lot more time),
// I would probably do a lot of Googling and reading docs and write some
// proper tests for the /new and /guess POST routes.
