import readline from "readline";
export async function readHiddenPassword(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const stdin = process.stdin;
    const onData = (char: Buffer) => {
      const str = char.toString("utf-8");

      switch (str) {
        case "\n":
        case "\r":
        case "\u0004": // Ctrl-D
          stdin.removeListener("data", onData);
          if (stdin.isTTY) {
            stdin.setRawMode(false);
          }
          rl.close();
          console.log(); // Add newline after password input
          resolve(password);
          break;
        case "\u0003": // Ctrl-C
          process.exit(0);
          break;
        case "\x7f": // Backspace
        case "\b": // Backspace (Windows)
          if (password.length > 0) {
            password = password.slice(0, -1);
          }
          break;
        default:
          password += str;
          break;
      }
    };

    let password = "";
    process.stdout.write(prompt);

    if (stdin.isTTY) {
      stdin.setRawMode(true);
    }
    stdin.resume();
    stdin.on("data", onData);
  });
}
