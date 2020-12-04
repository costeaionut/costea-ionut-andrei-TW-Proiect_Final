const slider = document.querySelector(".slider");
const animated_image = document.querySelector(".animated-image");
const headline = document.querySelector(".Headline");
const meniu = document.querySelector("header");



const tl = new TimelineMax();

tl.fromTo(animated_image, 1, {
    height: '0%'
}, {
    height: '70%',
    ease: Power2.easeInOut
}).fromTo(animated_image, 1.2, {
    width: '100%'
}, {
    width: '80%',
    ease: Power2.easeInOut
}).fromTo(slider, 1.2, {
    x: "-100%"
}, {
    x: "0%",
    ease: Power2.easeInOut
},
"-=1.2"
);