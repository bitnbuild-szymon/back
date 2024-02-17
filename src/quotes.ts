import quotes from "../configs/quotes.json";

function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export { getRandomQuote };
