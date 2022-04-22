var song;
var img
var fft
var amp
var particles = []

var start = true;

function preload(){ 
  //start = true;
  //song = loadSound('a.mp3')

  img = loadImage('bg.jpg')
}

function setup() {
  createCanvas(windowWidth, windowHeight)
  angleMode(DEGREES)
  imageMode(CENTER)
  song = new p5.AudioIn(); 
  song.start();

  fft = new p5.FFT()
  fft.setInput(song)

  //img.filter(BLUR, 30)

  noLoop()
  
  //createCanvas(400, 400)
}

function draw() {
  background(0)
  stroke(255)
  strokeWeight(5)
  noFill()

  translate(width / 2, height / 2)

  image(img, 0, 0, width, height) 


  fft.analyze()
  amp = fft.getEnergy(20, 200)
  console.log(`AMP: ${amp}`)

  var wave = fft.waveform()  

  for (var t = -1; t <= 1; t += 2) {
    beginShape()
    for (var i = 0; i <= 180; i += 1) {
      var index = floor(map(i, 0, width, 0, wave.length))

      
      var r = map(wave[index], -1, 1, 150, 350)      
      var x = r * sin(i) * t
      var y = r * cos(i)

      vertex(x, y)

      //console.log(`x: ${x}, y: ${y})`)
    }
    endShape()
  }

  var p = new Particle()
  particles.push(p)

  for(var i = particles.length -1; i>= 0; i--){
    if(!particles[i].edges()){
      particles[i].update(amp>254)
      particles[i].show()
    } else{
      particles.splice(i,1)
    }
    
  }
  

}

function mouseClicked(){
  if(start){
    song.start()
    start = false
    loop()
  }
  else{
    song.stop()
    start = true
    noLoop()
  }

  // if(song.isPlaying()){
  //   song.pause()
  // }
  // else{
  //   song.play()
  // }
}

class Particle{
  constructor() {
    this.pos = p5.Vector.random2D().mult(250)
    this.vel = createVector(0,0)
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001))

    this.w = random(5, 7)

    this.color = [random(200, 255), random(200, 255),random(200, 255),]
  }
  update(cond){
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    if(cond){
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
    }
  }
  edges(){
    if( this.pos.x < -width / 2 || this.pos.y > width / 2 ||
    this.pos.y < -height / 2 || this.pos.y > height / 2){
      return true
    }
    else{
      return false
    }
  }
  show(){
    noStroke()
    fill(this.color)
    ellipse(this.pos.x, this.pos.y, this.w)
  }
}