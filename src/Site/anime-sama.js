const bot = {
  cookie: "J'ACCEPTE",
  pub: "Cliquer sur une pub est le meilleur moyen de nous soutenir.",
};

export const getAllChapters = async (page) => {
  return await page.evaluate(() => {
    const chapters = [];
    const options = document.querySelector("#selectChapitres").options;

    for (const e of options) {
      if (isNaN(e.innerText.replace("Chapitre ", ""))) continue; // Clear les chapitres spéciaux

      chapters.push(e.innerText.replace("Chapitre ", ""));
    }

    return chapters;
  });
};

export const getTitle = async (page) => {
  return await page.evaluate(() =>
    document
      .querySelector("#titreOeuvre")
      .innerText.toUpperCase()
      .replaceAll(" ", "-")
  );
};

export const getChapterTitle = async (page, chapter, allChapters) => {
  return await page.evaluate(
    (chapter, allChapters) =>
      allChapters[allChapters.indexOf(chapter)].replace("Chapitre ", ""),
    chapter,
    allChapters
  );
};

export const newChapter = async (page, chapter) => {
  return await page.evaluate(
    async (chapter, bot) => {
      document.querySelectorAll("button").forEach((e) => {
        if (e.innerText === bot.cookie) e.click();
      });

      document.querySelectorAll("p").forEach((e) => {
        if (e.innerText === bot.pub) {
          e.parentNode.style.display = "none";
        }
      });

      document.querySelector("#topBtn").style.display = "none";
      document.querySelector("#selectChapitres").value = `Chapitre ${chapter}`;

      selectChapitre();

      document.querySelector("#scansPlacement").style.marginTop = "-200px";

      ["nextChapitre", "lastChapitre", "prevChapitre"].forEach((e) => {
        document.querySelectorAll(`#${e}`).forEach((element) => {
          element.style.display = "none";
        });
      });
    },
    chapter,
    bot
  );
};
