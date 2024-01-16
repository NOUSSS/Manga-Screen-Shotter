import figlet from "figlet";

export const ascii = () =>
  new Promise((res) => {
    figlet("MANGA SCREENSHOTTER", { font: "Bloody" }, (_, data) => {
      console.log(`${data}`.magenta);

      res(true);
    });
  });
