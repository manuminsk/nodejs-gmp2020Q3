import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', reversString);

function reversString(input) {
  if (!input || !input.length) {
    process.stdout.write('Process finished...');
    process.exit(0);
  }

  process.stdout.write(
    input
      .split('')
      .reverse()
      .join('')
  );
}
