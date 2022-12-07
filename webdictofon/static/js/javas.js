var i = 0;
function change_microphone(){
    if ( i == 0) {
        document.getElementById("button_microphone1").src="././static/img/stop_microphone.png";
        document.getElementById("button_microphone1").setAttribute('style', 'width: 60%; height: 60%;')
        i++;
    }
    else {
        document.getElementById("button_microphone1").src="././static/img/microphone.png";
        document.getElementById("button_microphone1").setAttribute('style', 'width: 90%; height: 90%;')
        i--;
    }
};