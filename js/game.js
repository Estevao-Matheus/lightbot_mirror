const TILE_WIDTH = 100;
const TILE_HEIGHT = 50;

let tile_images = []
let x_start ;
let y_start ;

function draw_tile(img, x, y) {
  let x_screen = x_start + (x - y) * TILE_WIDTH/2;
  let y_screen = y_start + (x + y) * TILE_HEIGHT/2;
  image(img, x_screen,y_screen);
}


function setup() {
    createCanvas(windowWidth, windowHeight);
    x_start = width/2 - TILE_WIDTH/2; 
    y_start = 50;
    tile_images.push(loadImage('./tiles/grass.png'));
    tile_images.push(loadImage("./tiles/sand.png"));
    tile_images.push(loadImage("./tiles/water.png"));
}

function draw() {
  background("black");
  draw_tile(tile_images[0], 0, 0);
  draw_tile(tile_images[1], 1, 0);
  draw_tile(tile_images[0], 2, 0);
  draw_tile(tile_images[0], 0, 1);
  draw_tile(tile_images[1], 1, 1);
  draw_tile(tile_images[0], 2, 1);
  draw_tile(tile_images[0], 0, 2);
  draw_tile(tile_images[1], 1, 2);
  draw_tile(tile_images[0], 2, 2);
}
