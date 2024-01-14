import "colors";

export default {
  prompt: (ask) =>
    new Promise((res) => {
      process.stdin.resume();

      const terminalWidth = process.stdout.columns;
      const startPosition = Math.max(0, Math.floor(terminalWidth / 3));
      const positionedText = " ".repeat(startPosition) + ask;

      process.stdout.write(positionedText);

      process.stdin.on("data", (response) => {
        process.stdin.pause();

        res(response.toString().trim());
      });
    }),

  formatURL: (url) => {
    const premierSlashIndex = url.indexOf("/", url.indexOf("//") + 2);

    if (premierSlashIndex !== -1) {
      return url.substring(0, premierSlashIndex);
    }

    return url;
  },

  getName: (url) => {
    const urlFormated = url.replace(/^(https?:\/\/)/, "");

    return urlFormated.split("/")[0].split(".")[0];
  },

  print: {
    error: (txt) => middlePrint(`(` + "-".red + ") " + txt),
    valid: (txt) => middlePrint(`(` + "+".green + ") " + txt),
    info: (txt) => middlePrint(`(` + "*".cyan + ") " + txt),
  },
};

function middlePrint(text, len = false) {
  const terminalWidth = process.stdout.columns;
  const startPosition = len
    ? Math.max(0, Math.floor((terminalWidth - text.length) / 3))
    : Math.max(0, Math.floor(terminalWidth / 3));

  const positionedText = " ".repeat(startPosition) + text;

  console.log(positionedText);
}
