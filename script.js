let num = 0;
let list = [];
let arr2 = [];
var text = document.getElementById("vocabulary");
var elem = document.getElementById("oBar");
let testValue;
let strList = "";
let width = 1;
let imin = 0;
let imax = pre_list.length;
let omin = document.getElementById("min");
let omax = document.getElementById("max");
let wordList = [];
let word;
let autoSay = false;
let mode = "暗色模式";
random(omin.value, omax.value);
function random(min, max) {
    var arr1 = [];
    arr2 = [];
    list = [];
    //console.log(max)
    min = Math.abs(parseInt(min));
    max = Math.abs(parseInt(max));
    if (!min) min = 1;
    if (!max || max > 1900) max = pre_list.length - 1;
    if (min > 1900) min = pre_list.length - 1;
    if (min > max) {
        testValue = max;
        max = min;
        min = testValue;
    }
    imin = min;
    imax = max + 1;
    for (var i = 0; i < imax - imin; i++) {
        arr1[i] = i;
    }
    shuffleArray(arr1);
    //console.log(arr1);
    for (var i = 0; i < imax - imin; i++) {
        list[arr1[i]] = pre_list[min + i];
        arr2[arr1[i]] = i;
    }
    //console.log(arr1,arr2);
    num = 0;
    text.innerHTML = list[num];
    width = 1;
    elem.style.width = 100 * (width / (imax - imin)) + '%';
    document.getElementById("label").innerHTML = "(" + width + "/" + (imax - imin) + ") ";
    if (width >= (imax - imin)) document.getElementById("label").innerHTML = "達標! ";
}
function shuffleArray(inputArray) {
    inputArray.sort(() => Math.random() - 0.5);
}
function next() {
    if (num < imax - imin - 1) {
        num++;
        obutton();
        move(1);
    }
}
function privous() {
    if (num > 0) {
        num--;
        obutton();
        move(-1);
    }
}
function number() {
    return arr2[num] + imin;
}
window.addEventListener('keydown', function (e) {
    //console.log(e.keyCode);
    if (e.keyCode === 39) next();
    if (e.keyCode === 37) privous();
    if (e.keyCode === 86) speak();
    if (e.keyCode === 82) random(omin.value, omax.value);
    if (e.keyCode === 77) fnWordList();
    if (e.keyCode === 70) search();
}, false);
window.addEventListener('click', function (e) {
    let posX = event.clientX;
    let maxX = document.body.clientWidth;
    let posY = event.clientY;
    let maxY = document.body.clientHeight;
    if ((maxX / posX > 2) && (maxY / posY > 0.75) && (maxY / posY < 1.5)) privous();
    if ((maxX / posX < 2) && (maxY / posY > 0.75) && (maxY / posY < 1.5)) next();
}, false);
function getDirection(startx, starty, endx, endy) {
    var angx = endx - startx;
    var angy = endy - starty;
    var result = 0;

    //如果滑動距離太短
    if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
        return result;
    }

    var angle = getAngle(angx, angy);
    if (angle >= -135 && angle <= -45) {
        result = 1;
    } else if (angle > 45 && angle < 135) {
        result = 2;
    } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
        result = 3;
    } else if (angle >= -45 && angle <= 45) {
        result = 4;
    }

    return result;
}
function getAngle(angx, angy) {
    return Math.atan2(angy, angx) * 180 / Math.PI;
};
//手指接觸螢幕
document.addEventListener("touchstart", function (e) {
    startx = e.touches[0].pageX;
    starty = e.touches[0].pageY;
}, false);
//手指離開螢幕
document.addEventListener("touchend", function (e) {
    var endx, endy;
    endx = e.changedTouches[0].pageX;
    endy = e.changedTouches[0].pageY;
    var direction = getDirection(startx, starty, endx, endy);
    switch (direction) {
        case 0:
            //no
            break;
        case 1:
            speak();
            break;
        case 2:
            //down
            break;
        case 3:
            //left
            break;
        case 4:
            //right
            break;
        default:
    }
}, false);
function move(add) {
    width += add;
    elem.style.width = 100 * (width / (imax - imin)) + '%';
    document.getElementById("label").innerHTML = "(" + width + "/" + (imax - imin) + ") ";
    if (width >= (imax - imin)) document.getElementById("label").innerHTML = "達標! ";
    text.innerHTML = list[num];
    if (autoSay) speak();
}
function fnWordList() {
    word = "[" + number() + "]" + pre_list[arr2[num] + imin];
    //console.log(word)
    //console.log(wordList.indexOf(word))
    if (wordList.indexOf(word) + 1) {
        wordList.splice(wordList.indexOf(word), 1);
        print();
        obutton();
    } else {
        wordList.push(word);
        //console.log(wordList.indexOf(word))
        print();
        obutton();
    }

}
function obutton() {
    word = "[" + number() + "]" + pre_list[arr2[num] + imin];
    if (wordList.indexOf(word) + 1) return document.getElementById('olist').innerHTML = "取消";
    document.getElementById('olist').innerHTML = "標記";
}
function print(clear) {
    if (clear) wordList = [];
    strList = "";
    for (let i = wordList.length - 1; i >= 0; i--) {
        strList += wordList[i] + "<br>";
    }
    document.getElementById('oWordList').innerHTML = strList;
}

//感謝分享! https://gist.github.com/Eotones/d67be7262856a79a77abeeccef455ebf
function speak() {
    let reqword = text.innerHTML;
    if (!reqword) reqword = "What the heck is that?";
    const synth = window.speechSynthesis;
    const speak = (msg) => {
        let u = new SpeechSynthesisUtterance();
        u.text = msg;
        let voices = synth.getVoices();

        for (let index = 0; index < voices.length; index++) {
            /*
            "Google US English"
            "Google 日本語"
            "Google 普通话（中国大陆）"
            "Google 粤語（香港）"
            "Google 國語（臺灣）"
            */
            //console.log(this.voices[index].name);
            if (voices[index].name == "Google US English") {
                u.voice = voices[index];
                break;
            } else {
                u.lang = 'en';
            }
        }
        synth.speak(u);
    };

    speak(reqword);
}
function fnAutoSay() {
    if (autoSay) {
        autoSay = false;
        document.getElementById('oAutoSay').innerHTML = "自動發音[OFF]";
    } else {
        autoSay = true;
        document.getElementById('oAutoSay').innerHTML = "自動發音[ON]";
    }
}
function operate() {
    if (detectmob()) {
        Swal.fire({
            title: '上一個 [點左螢幕]<br>下一個 [點右螢幕]<br>發音 [上滑]',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            },
            confirmButtonText: '🌓',
            cancelButtonText: '了解',
            showCancelButton: true,
            preConfirm: () => {
                darkmode.toggle();
            }
        })
    } else {
        Swal.fire({
            title: '上一個 [⇽]<br>下一個 [⇾]<br>發音 [V]<br>標記 [M]<br>搜尋 [F]<br>隨機排序 [R]',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            },
            confirmButtonText: '🌓',
            cancelButtonText: '了解',
            showCancelButton: true,
            preConfirm: () => {
                darkmode.toggle();
            }
        })
    }
}
function search(vocab) {
    swal.fire({
        title: '搜尋',
        html:
            '<input id="search" class="swal2-input">',
        showCancelButton: true,
        focusConfirm: false,
        preConfirm: () => {
            let str = "";
            var search = document.getElementById("search").value;
            search = strFilter(search);
            if (search === "") return;
            const result = pre_list.filter((value) => value.match(search));
            const seq = pre_list.filter((value) => value.match(search));
            for (let i = 0; i < result.length; i++) {
                for (let j = 0; j < pre_list.length; j++) {
                    if (pre_list[j] === result[i]) {
                        str += "[" + j + "] " + result[i] + "<br>";
                        break;
                    }
                }
            }
            swal.fire({
                title: str,
                text: '搜尋結果(' + result.length + ')'
            })
        }
    })
}
function strFilter(str) {
    var pattern = /[`~!@#$^&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？]/g;
    return str.replace(pattern, "");
}
function detectmob() {
    if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
    ) {
        return true;
    }
    else {
        return false;
    }
}