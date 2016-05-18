// variables
var $window = $(window), gardenCtx, gardenCanvas, $garden, garden;
var clientWidth = $(window).width();
var clientHeight = $(window).height();
var resizeTimer;
var ratio = Math.min($(window).width() / 35,$(window).height() / 35);

$(function () {
  // setup garden
  $loveHeart = $("#loveHeart");
  $garden = $("#garden");
  gardenCanvas = $garden[0];
  gardenCanvas.width = $("#loveHeart").width();
  gardenCanvas.height = $("#loveHeart").height();
  gardenCtx = gardenCanvas.getContext("2d");
  gardenCtx.globalCompositeOperation = "lighter";
  garden = new Garden(gardenCtx, gardenCanvas);


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
  var y = - (ratio + 2) * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
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

(function($) {
  $.fn.lyricView = function() {
    this.each(function() {
      var $ele = $(this), str = $ele.html(), progress = 0, child = $("#messages");
      var timer = setInterval(function() {
        child.css('margin-top',parseInt(child.css('margin-top')) + -1);
        if (parseInt(child.css('margin-top')) < -child.height() + 40) {
          clearInterval(timer);
        }
      }, 100);
    });
    return this;
  };
})(jQuery);
