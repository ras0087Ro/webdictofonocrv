// navigator.mediaDevices.getUserMedia({ audio: true})
//     .then(stream => {
//         const mediaRecorder = new MediaRecorder(stream)});


// navigator.mediaDevices.getUserMedia({ audio: true})
// .then(stream => {
//     const mediaRecorder = new MediaRecorder(stream);
//     let voice = [];
//     document.querySelector('#start').addEventListener('click', function(){
//         mediaRecorder.start();
//     });

//     mediaRecorder.addEventListener("dataavailable",function(event) {
//         voice.push(event.data);
//     });

//     document.querySelector('#stop').addEventListener('click', function(){
//         mediaRecorder.stop();
//     });
// });
// mediaRecorder.addEventListener("stop", function() {
//     const voiceBlob = new Blob(voice, {type: 'audio/wav'});
// })


var i = 0;
function change_microphone(){
    if ( i == 0) {
        document.getElementById("button_microphone1").src="././static/img/stop_microphone.png";
        document.getElementById("button_microphone1").setAttribute('style', 'width: 60%; height: 60%;')
        mediaRecorder.start()
        i++;
    }
    else {
        document.getElementById("button_microphone1").src="././static/img/microphone.png";
        document.getElementById("button_microphone1").setAttribute('style', 'width: 90%; height: 90%;')
        mediaRecorder.stop()
        i--;
    }
};