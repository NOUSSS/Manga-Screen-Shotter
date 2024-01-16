import "colors";

export const prompt = (ask) =>
  new Promise((res) => {
    process.stdin.resume();

    middlePrint(ask, true);

    process.stdin.on("data", (response) => {
      process.stdin.pause();

      res(response.toString().trim());
    });
  });

export const formatURL = (url) => {
  const premierSlashIndex = url.indexOf("/", url.indexOf("//") + 2);

  if (premierSlashIndex !== -1) {
    return url.substring(0, premierSlashIndex);
  }

  return url;
};

export const print = {
  error: (txt) => middlePrint(`(` + "-".red + ") " + txt),
  valid: (txt) => middlePrint(`(` + "+".green + ") " + txt),
  info: (txt) => middlePrint(`(` + "*".cyan + ") " + txt),
};

function middlePrint(text, usingProcess = false) {
  if (usingProcess) {
    const terminalWidth = process.stdout.columns;
    const startPosition = Math.max(0, Math.floor(terminalWidth / 3));

    const positionedText = " ".repeat(startPosition) + text;

    process.stdout.write(positionedText);
  } else {
    const terminalWidth = process.stdout.columns;
    const startPosition = Math.max(0, Math.floor(terminalWidth / 3));

    const positionedText = " ".repeat(startPosition) + text;

    console.log(positionedText);
  }
}
