import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
});

rl.on("line", reversString);

function reversString(input) {
  if (!input || !input.length) {
    process.stdout.write("Process finished...");
    process.exit(0);
  }

  const response = input.split("").reverse().join("");

  process.stdout.write(`${response}\n`);
}
