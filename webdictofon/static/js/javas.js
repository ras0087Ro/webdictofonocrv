var i=0;
var image = document.getElementById("button_microphone");
// Добавьте свои картинки в массив через запятую
var imgs = new Array('{% static img/stop_microphone.png%}','{% static img/microphone.png%}');
function imgsrc() {
    i++;
    i %= imgs.length;
    image.data = imgs[i];
}