package main

// setting TargetWord and LettersGussed to `json:"-"`
// so they don't get returned in the API response
type Game struct {
	ID               string   `json:"id"`
	GuessesRemaining int      `json:"guesses_remaining"`
	Current          string   `json:"current"`
	TargetWord       string   `json:"-"`
	LettersGuessed   []string `json:"-"`
}

type Guess struct {
	ID    string `json:"id"`
	Guess string `json:"guess"`
}
