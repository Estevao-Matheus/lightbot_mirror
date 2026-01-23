const TILE_WIDTH = 100;
const TILE_HEIGHT = 50;

let tile_images = []

function setup() {
    createCanvas(windowWidth, windowHeight);
    tile_images.push(loadImage('./tiles/grass.png'));
    tile_images.push(loadImage("./tiles/sand.png"));
    tile_images.push(loadImage("./tiles/water.png"));
}


function draw() {
  background("black");
  image(tile_images[0], width/2 - TILE_WIDTH/2, 50);
}