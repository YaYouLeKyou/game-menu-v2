const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = "./media/drunkinalien3.png";

//general settings
let gamePlaying = false;
const gravity = 0.5;
const speed = 9.5;
const size = [51, 25];
const jump = -11.5;
const cTenth = canvas.width / 20;

// pipe settings
const pipeWidth = 50;
const pipeGap = 270;
const pipeLoc = () =>
  Math.random() * (canvas.height - (pipeGap - pipeWidth) - pipeWidth);

let index = 0,
  bestScore = 0,
  currentScore = 0,
  pipes = [],
  flight,
  flyHeight;

const setup = () => {
  currentScore = 0;
  flight = jump;
  flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  // set initial flyHeight (middle of screen - size of the bird)
  flyHeight = canvas.height / 2 - size[1] / 2;

  // setup first 3 pipes
  pipes = Array(3)
    .fill()
    .map((a, i) => [canvas.width + i * (pipeGap + pipeWidth), pipeLoc()]);
  console.log(pipes);
};

const render = () => {
  // make the pipe and bird moving
  index++;

  // ctx.clearRect(0, 0, canvas.width, canvas.height);

  // background first part
  ctx.drawImage(
    img,
    115,
    0,
    250,
    canvas.height,
    -((index * (speed / 2)) % 431) + 431,
    0,
    canvas.width,
    canvas.height
  );
  // background second part
  ctx.drawImage(
    img,
    115,
    0,
    250,
    canvas.height,
    -(index * (speed / 2)) % 431,
    0,
    canvas.width,
    canvas.height
  );

  if (gamePlaying) {
    //ufo
    ctx.drawImage(
      img,
      405,
      Math.floor(index % 1) * size[0],
      ...size,
      cTenth,
      flyHeight,
      ...size
    );
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  } else {
    ctx.drawImage(
      img,
      405,
      Math.floor(index % 1) * size[0],
      ...size,
      cTenth,
      flyHeight,
      ...size
    );

    flyHeight = canvas.height / 2 - size[1] / 2;
    // text accueil
    ctx.fillText(`Best score : ${bestScore}`, 85, 105);
    ctx.fillText("Click to play", 90, 335);
    ctx.font = "bold 30px courier";
  }
  // pipe display
  if (gamePlaying) {
    pipes.map((pipe) => {
      // pipe moving
      pipe[0] -= speed;

      // top pipe
      ctx.drawImage(
        img,
        409,
        250 - pipe[1],
        pipeWidth,
        pipe[1],
        pipe[0],
        0,
        pipeWidth,
        pipe[1]
      );
      // bottom pipe
      ctx.drawImage(
        img,
        413 + pipeWidth,
        108,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap,
        pipe[0],
        pipe[1] + pipeGap,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap
      );

      // give 1 point & create new pipe
      if (pipe[0] <= -pipeWidth) {
        currentScore++;
        // check if it's the best score
        bestScore = Math.max(bestScore, currentScore);

        // remove & create new pipe
        pipes = [
          ...pipes.slice(1),
          [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()],
        ];
        console.log(pipes);
      }

      // if hit the pipe, end
      if (
        [
          pipe[0] <= cTenth + size[0],
          pipe[0] + pipeWidth >= cTenth,
          pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1],
        ].every((elem) => elem)
      ) {
        gamePlaying = false;
        setup();
      }
    });
  }

  window.requestAnimationFrame(render);
};
setup();
img.onload = render;
// start game
document.addEventListener("click", () => (gamePlaying = true));
window.onclick = () => (flight = jump);

