
let interval = [null];

button.addEventListener('click', runStart);

async function runStart() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript(
    {
      target: {tabId: tab.id},
      func: start,
      args: [text.value, 50, interval],
    });
}



function start(text, updatePeriod, interval) {

  const br = [
    'cell-non-scheduled',
    'cell-scheduled-maybe',
    'cell-scheduled',
  ]

  function setIds() {
    const tableWrap = document.getElementById('tableRenderElem')
    const tds = tableWrap.getElementsByTagName('td')

    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 25; x++) {
        if (x === 0) continue; // skip first column
        const i = y * 25 + x
        tds[i].id = `td_${y}-${x-1}`
      }
    }
  }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "9px sans-serif";
    ctx.fillText(text, -xOffset, 6);

    xOffset += 1;
    if (xOffset > maxXOffset)
      xOffset = -maxXOffset;

    for (let x = 0; x < 24; x++) {
      for (let y = 0; y < 7; y++) {
        let pixel = ctx.getImageData(x, y, 1, 1).data;
        let brightness = pixel[3] / 255;

        const td = document.getElementById(`td_${y}-${x}`)

        br.forEach((c) => td.classList.remove(c))
        if (brightness < 0.3) td.classList.add(br[0])
        else if (brightness < 0.5) td.classList.add(br[1])
        else td.classList.add(br[2])
      }
    }
  }

  const maxXOffset = text.length * 9 / 2;
  let xOffset = maxXOffset;
  setIds();

  const canvas = document.createElement('canvas');
  canvas.width = 24;
  canvas.height = 7;
  const ctx = canvas.getContext("2d");


  if (interval[0]) clearInterval(interval);
  interval[0] = setInterval(update, updatePeriod);
}










//
// const video = document.createElement('video');
// video.src = 'https://svinua.cf/badapple.mp4';
// video.autoplay = true;
// video.controls = true;
// video.muted = false;
// video.crossOrigin = "anonymous";
// document.body.appendChild(video);
//
//
// video.onplay = () => {
//   update();
// }
