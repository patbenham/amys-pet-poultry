// import anime from './node_modules/animejs/lib/anime.js';

var checkTimeLine = anime.timeline({ autoplay: true, direction: 'alternate', loop: true });

var fbicon = document.getElementById("Blue_1_");
fbicon.setAttribute("fill", "red");
checkTimeLine.add({
  targets: fbicon,
  translateX: 250,
  easing: 'easeOutExpo',
  duration: 750
});



console.log('hello world');
