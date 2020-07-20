import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
});

rl.on("line", reversString);

function reversString(input) {
  if (!input || !input.length) {
    console.log("Process finished...");
    process.exit(0);
  }

  console.log(input.split("").reverse().join(""));
}
