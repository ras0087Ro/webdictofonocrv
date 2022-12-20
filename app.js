
const record = document.querySelector('.record');
const stop = document.querySelector('.stop');
const soundClips = document.querySelector('.sound-clips');
const canvas = document.querySelector('.visualizer');
const mainSection = document.querySelector('.main-controls');
const download = document.querySelector('.download');
var h1 = document.getElementsByTagName('h1')[0];

//for time func
var sec = 0;
var min = 0;
var hrs = 0;
var t;
// perezapis audio
var przps = 0;
// disable stop button while not recording

stop.disabled = true;

// visualiser setup - create web audio api context and canvas

let audioCtx;
const canvasCtx = canvas.getContext("2d");

//main block for doing the audio recording

if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  const constraints = { audio: true };
  let chunks = [];

  let onSuccess = function(stream) {
    const mediaRecorder = new MediaRecorder(stream);

    visualize(stream);

    record.onclick = function() {
      mediaRecorder.start();
      console.log(mediaRecorder.state);
      console.log("recorder started");
      record.style.background = "red";

      stop.disabled = false;
      record.disabled = true;
      timer()
    }

    stop.onclick = function() {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log("recorder stopped");
      record.style.background = "";
      record.style.color = "";
      // mediaRecorder.requestData();

      stop.disabled = true;
      record.disabled = false;
      reset()
    }

    mediaRecorder.onstop = function(e) {
      console.log("data available after MediaRecorder.stop() called.");

      const clipName = prompt('Enter a name for your sound clip?','My unnamed clip');

      const clipContainer = document.createElement('article');
      const clipLabel = document.createElement('p');
      const audio = document.createElement('audio');
      const deleteButton = document.createElement('button');

      clipContainer.classList.add('clip');
      audio.setAttribute('controls', '');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete';

      if(clipName === null) {
        clipLabel.textContent = 'My unnamed clip';
      } else {
        clipLabel.textContent = clipName;
      }

      clipContainer.appendChild(audio);
      clipContainer.appendChild(clipLabel);
      clipContainer.appendChild(deleteButton);
      soundClips.appendChild(clipContainer);

      audio.controls = true;
      const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
      chunks = [];
      recordedChunks = [];
      const audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;
      console.log("recorder stopped");
      download.onclick = function() {
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = audioURL;
        a.download = "test.wav";
        a.click();
        var xhr=new XMLHttpRequest();
        xhr.onload=function(e) {
          if(this.readyState === 4) {
              console.log("Server returned: ",e.target.responseText);
          }
        };
        recorder && recorder.exportWAV(function(blob) {
          // Generate the 'File'
          var data = new FormData();
          data.append('file', blob);
      
          // Make the HTTP request
          var oReq = new XMLHttpRequest();
      
          // POST the data to upload.php
          oReq.open("POST", 'upload.php', true);
          oReq.onload = function(oEvent) {
            // Data has been uploaded
          };
          oReq.send(data);
        });
      }
      deleteButton.onclick = function(e) {
        let evtTgt = e.target;
        evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
      }

      clipLabel.onclick = function() {
        const existingName = clipLabel.textContent;
        const newClipName = prompt('Enter a new name for your sound clip?');
        if(newClipName === null) {
          clipLabel.textContent = existingName;
        } else {
          clipLabel.textContent = newClipName;
        }
      }
    }

    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
      recordedChunks.push(e.data);
      console.log(recordedChunks);
    }
  }

  let onError = function(err) {
    console.log('The following error occured: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
   console.log('getUserMedia not supported on your browser!');
}



function tick(){
  sec++;
  if (sec >= 60) {
      sec = 0;
      min++;
      if (min >= 60) {
          min = 0;
          hrs++;
      }
  }
}
function add() {
  tick();
  h1.textContent = (hrs > 9 ? hrs : "0" + hrs) 
         + ":" + (min > 9 ? min : "0" + min)
          + ":" + (sec > 9 ? sec : "0" + sec);
  timer();
}
function timer() {
  t = setTimeout(add, 1000);
}

function reset() {
    h1.textContent = "00:00:00";
    seconds = 0; minutes = 0; hours = 0;
    clearTimeout(t)
    sec = 0
}






function visualize(stream) {
  if(!audioCtx) {
    audioCtx = new AudioContext();
  }

  const source = audioCtx.createMediaStreamSource(stream);

  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);
  //analyser.connect(audioCtx.destination);

  draw()

  function draw() {
    const WIDTH = canvas.width
    const HEIGHT = canvas.height;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    let sliceWidth = WIDTH * 1.0 / bufferLength;
    let x = 0;


    for(let i = 0; i < bufferLength; i++) {

      let v = dataArray[i] / 128.0;
      let y = v * HEIGHT/2;

      if(i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height/2);
    canvasCtx.stroke();

  }
}

window.onresize = function() {
  canvas.width = mainSection.offsetWidth;
}

window.onresize();