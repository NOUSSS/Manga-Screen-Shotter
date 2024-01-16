import * as AnimeSama from "./anime-sama.js";

export class Web {
  constructor() {
    this.animesama = {
      getAllChapters: AnimeSama.getAllChapters,
      getChapterTitle: AnimeSama.getChapterTitle,
      getTitle: AnimeSama.getTitle,
      newChapter: AnimeSama.newChapter,
    };
  }

  getAllChapters(page) {
    return this.animesama.getAllChapters(page);
  }

  getTitle(page) {
    return this.animesama.getTitle(page);
  }

  newChapter(chapter, page) {
    return this.animesama.newChapter(page, chapter);
  }

  getChapterTitle(chapter, allChapters, page) {
    return this.animesama.getChapterTitle(page, chapter, allChapters);
  }
}
