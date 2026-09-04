// 🚀 Welcome to the Frontend Mastery Code Playground!
// Write your code here and click "Run" (or press Ctrl+Enter / ⌘+Enter)

function greet(name: string) {
  return `Hello, ${name}! 👋`;
}

console.log(greet("Developer"));
console.log("Ready to practice coding!");

// Try async code & promises:
setTimeout(() => {
  console.log("⏱️ Async timeout completed after 300ms!");
}, 300);

const numbers = [1, 2, 3, 4, 5];
const squares = numbers.map((n) => n ** 2);
console.log("Squares:", squares);
