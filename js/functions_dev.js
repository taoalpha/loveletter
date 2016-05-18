// variables
var $window = $(window), gardenCtx, gardenCanvas, $garden, garden;
var clientWidth = $(window).width();
var clientHeight = $(window).height();
var resizeTimer;
var ratio = Math.min($(window).width() / 35,$(window).height() / 35);
var offsetX, offsetY;

$(function () {
  // setup garden
  offsetX = $("#loveHeart").width() / 2;
  offsetY = $("#loveHeart").height() / 2 - 130;


  $loveHeart = $("#loveHeart");
  $garden = $("#garden");
  gardenCanvas = $garden[0];
  gardenCanvas.width = $("#loveHeart").width();
  gardenCanvas.height = $("#loveHeart").height();
  gardenCtx = gardenCanvas.getContext("2d");
  gardenCtx.globalCompositeOperation = "lighter";
  garden = new Garden(gardenCtx, gardenCanvas);

  // set up layout for messages
  $('#words').width(16*ratio);
  $('#words').height(80);
  $('#words').css('left',(gardenCanvas.width - 16*ratio) / 2);
  $('#words').css('top',gardenCanvas.height / 2 - 30);

  // renderLoop
  setInterval(function () {
    garden.render();
  }, Garden.options.growSpeed);

});

$(window).resize(function() {
  gardenCtx.clearRect(0, 0, gardenCanvas.width, gardenCanvas.height);
  clearTimeout(resizeTimer);
  ratio = Math.min($(window).width() / 35,$(window).height() / 35);
  resizeTimer = setTimeout(function() {
    startHeartAnimation();
  }, 250);
});

function getHeartPoint(angle) {
  // thanks to the sixth heart curve equation!!!
  var t = angle / Math.PI;
  var x = ratio * (16 * Math.pow(Math.sin(t), 3));
  var y = - (ratio) * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  return new Array(offsetX + x, offsetY + y);
}

function startHeartAnimation() {
  var interval = 100;
  var angle = 1;
  var heart = new Array();
  var animationTimer = setInterval(function () {
    var bloom = getHeartPoint(angle);
    var draw = true;
    for (var i = 0; i < heart.length; i++) {
      var p = heart[i];
      var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
      if (distance < Garden.options.bloomRadius.max * 1.3) {
        draw = false;
        break;
      }
    }
    if (draw) {
      heart.push(bloom);
      garden.createRandomBloom(bloom[0], bloom[1]);
    }
    if (angle >= 30) {
      clearInterval(animationTimer);
    } else {
      angle += 0.15;
    }
  }, interval);
}

function randomBloom() {
  var x = Math.random()*gardenCanvas.width;
  var y = Math.random()*gardenCanvas.height;
  garden.createRandomBloom(x, y);
}

(function($) {
  $.fn.lyricView = function() {
    this.each(function() {
      var $ele = $(this), str = $ele.html(), progress = 0, child = $("#messages"), prevheight = 0;
			$ele.html('');
			$ele.show();
			var timer2 = setInterval(function() {
				var current = str.substr(progress, 1);
				if (current == '<') {
					progress = str.indexOf('>', progress) + 1;
				} else {
					progress++;
				}
				$ele.html(str.substring(0, progress) + (progress & 1 ? '_' : ''));
        if (child.height() > prevheight) {
          child.css('margin-top',-child.height() + 70);
          prevheight = child.height();
        }
				if (progress >= str.length) {
					clearInterval(timer2);
          var randomB = setInterval(function() {
            randomBloom();
          }, 100);
				}
			}, 100);
    });
    return this;
  };
})(jQuery);

function showMsg() {
  if ($('.overlayer').length > 0) {
    $('.overlayer').remove();
    return;
  }
  var msg = $('#words').clone();
  msg.find('a').text("click to back");
  msg.addClass("overlayer");
  msg.css({
    "width":100+"%",
    "height":100+"%",
    "background-color": 'rgba(0,0,0,0.8)',
    "position":'fixed',
    "top":0,
    "z-index":10,
    "overflow":'auto',
    "left":0
  })
  msg.find('div').css({
    "padding":30,
    "color": 'white',
    "margin-top": 0
  });
  $('body').append(msg);
}
