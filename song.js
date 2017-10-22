//获取id
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return " ";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}


let array = [];
let parts = lyric.split("\n");
parts.forEach(function(string, index) {
  let xxx = string.split("]");
  xxx[0] = xxx[0].substring(1);
  let regex = /(\d+):([\d.]+)/;
  let matches = xxx[0].match(regex);
  let minute = +matches[1];
  let seconds = +matches[2];
  array.push({
    time: minute * 60 + seconds,
    lyric: xxx[1]
  });
});

//歌曲
var $deSname = $("#des-name");
var $playCover = $("#playCover");
var $playbg = $("#pagebg");
var querysong = new AV.Query("Song");
query.get(id).then(
  function(song) {
    let { name, singer, cover } = song.attributes;
    let h2 = `
        <span>${name}</span>
        <span>-</span>
        <small>${singer}</small>
              `
    let img = `
        <img src="${cover}" alt="封面">
              `
    let pagebg = `
        <div class="pagebg" style="background: transparent url(${cover}) no-repeat center;"></div>
              `
    $deSname.append(h2);
    $playCover.append(img);
    $playbg.append(pagebg);
  },
  function(error) {
    alert("获取歌曲失败");
  }
);

//把歌词添加到页面上
array.map(function(object) {
  if (!object) {
    return;
  }
  let $scroll = $(".scroll");
  let $p = $("<p/>");
  $p.attr("data-time", object.time).text(object.lyric);
  $p.appendTo($scroll);
});

setInterval(function() {
  let $scrolls = $(".scroll>p");
  let current = video.currentTime;
  let $whichLine;
  for (var i = 0; i < array.length; i++) {
    let currentLineTime = $scrolls.eq(i).attr("data-time");
    let nextLineTime = $scrolls.eq(i + 1).attr("data-time");
    if (i === array.length - 1) {
      // console.log(array[i].time)
      $whichLine = $scrolls.eq(i);
    } else if (
      array[i + 1] != undefined &&
      currentLineTime <= current &&
      nextLineTime > current
    ) {
      $whichLine = $scrolls.eq(i);
      break;
    }
  }
  if ($whichLine) {
    $whichLine
      .addClass("active")
      .prev()
      .removeClass("active");
    let top = $whichLine.offset().top;
    let scrollTop = $(".scroll").offset().top;
    let delta = top - scrollTop - $(".lyric").height() / 3;
    $(".scroll").css("transform", `translateY(-${delta}px)`);
  }
}, 500);

let id = getParameterByName("id");
var query = new AV.Query("Song");
query.get(id).then(function(song) {
  let { url, lyric } = song.attributes;
  let video = document.createElement("video");
  video.src = url;
  video.oncanplay = function() {
    $(".icon-pause").on("click", function() {
      video.pause();
      $("#playCover").addClass("pause");
    });
    $(".icon-playing").on("click", function() {
      video.play();
      $("#playCover").removeClass("pause");
    });
  };
});
