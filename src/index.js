import "colors";

import puppeteer from "puppeteer";
import fs from "fs";
import ascii from "./functions/ascii.js";
import Web from "./Site/Web.js";

import { zip } from "zip-a-folder";
import { Timer } from "timer-node";

import * as functions from "./functions/functions.js";

const { prompt, formatURL, print } = functions.default;

const scraper = new Web();
const timer = new Timer({ label: "test-timer" });

(async () => {
  print.info(
    "Exemple d'URL (pour One Piece) : https://anime-sama.fr/catalogue/one-piece/scan/vf/"
      .grey
  );

  console.log("\n");

  const scans = await prompt(
    "Quels scans voulez vous télécharger (pris en compte: anime-sama) ? "
  );

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  console.clear();
  console.log(ascii.text);

  print.info(`Connexion à ${formatURL(scans)} en cours...`);

  await page
    .goto(scans, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    })
    .catch(async (err) => {
      print.error("Echec de la connexion");

      const printError = await prompt("Afficher l'erreur ? [y/n] : ");

      switch (printError) {
        case "y":
          console.log(err);

          return process.exit(0);

        case "n":
          return process.exit(0);

        default:
          if (printError.includes("y")) {
            console.log(err);

            return process.exit(0);
          } else if (printError.includes("n")) {
            return process.exit(0);
          } else {
            return process.exit(0);
          }
      }
    })
    .then(() => {
      print.valid("Connexion réussi.");
      console.log("\n");
    });

  const allChapters = await scraper.getAllChapters(page);

  const lastChapter = allChapters[allChapters.length - 1];
  const [firstChapter] = allChapters;

  const title = await scraper.getTitle(page);

  let startChapter = await prompt(
    `À partir de quel chapitre (debut : ${firstChapter}) ? `
  );

  while (
    startChapter < Number(firstChapter) ||
    startChapter > Number(lastChapter)
  ) {
    startChapter = await prompt(
      `À partir de quel chapitre (debut : ${firstChapter}) ? `
    );
  }

  let endChapter = await prompt(
    `Jusqu'a quel chapitre (fin : ${lastChapter}) ? `
  );

  while (endChapter < startChapter || endChapter > Number(lastChapter)) {
    endChapter = await prompt(
      `Jusqu'a quel chapitre (fin : ${lastChapter}) ? `
    );
  }

  console.log("\n");

  if (!fs.existsSync("src/Manga/" + title) || !fs.existsSync("src/Manga/")) {
    fs.mkdirSync("src/Manga/" + title);
    fs.mkdirSync("src/Manga/" + title + "/chapters");
  }

  timer.start();

  for (const chapter of allChapters) {
    if (Number(chapter) < Number(startChapter)) continue;
    if (Number(chapter) > Number(endChapter)) break;

    await scraper.newChapter(chapter, page);

    const chapterTitle = await scraper.getChapterTitle(
      name,
      chapter,
      allChapters,
      page
    );

    await page.waitForNetworkIdle();
    await page.pdf({
      path: `src/Manga/${title}/chapters/${chapterTitle}.pdf`,
      printBackground: true,
    });

    print.valid(
      `${chapterTitle}`.green +
        " : téléchargé dans" +
        ` ${title}/chapters/${chapterTitle}.pdf`.grey
    );
  }

  console.log("\n");

  timer.stop();
  await browser.close();

  print.info(`Compression du dossier ${title} en .zip en cours.`);

  await zip(
    `src/Manga/${title}/chapters`,
    `src/Manga/${title}/${title}-chapters.zip`
  );

  print.info(
    `Tout les chapitres à partir du ` +
      `${startChapter}`.cyan +
      " jusqu'au " +
      `${endChapter}`.cyan +
      ` sont sauvgardés dans ` +
      `src/Manga/${title}/${title}.zip`.grey
  );

  const { d, h, m, s, ms } = timer.time();

  print.info(
    `En${d > 0 ? `${d} jour${d > 1 ? "s" : ""}`.cyan : ""}${
      h > 0 ? `, ${h} heure${h > 1 ? "s" : ""}`.cyan : ""
    }${m > 0 ? `, ${m} minute${m > 1 ? "s" : ""}`.cyan : ""}${
      d === 0 && h === 0 && m === 0 ? "" : " et"
    }${s > 0 ? ` ${s}.${ms} seconde${s > 1 ? "s" : ""}`.cyan : ""}`
  );
})();
