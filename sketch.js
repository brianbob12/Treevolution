var materialProperties={}
var simulationPerameters={}
var myTree={}
var myRandomTree={}
var currentGeneration={}

let resetButton,nextGenButton
let top3
var lastScores=[]

const size=30

var cx=0
var cy=0
var mp=false
var offX=0
var offY=0

var myScale=0.5

function preload(){
  materialProperties= loadJSON("materialProperties.json")
  simulationPerameters= loadJSON("simulationPerameters.json")
}

function setup() {
  createCanvas(1024, 1024);
  
  //setting up buttions
  resetButton=createButton("Reset")
  resetButton.position(0,0)
  resetButton.mousePressed(reset)
  nextGenButton=createButton("Next Gen")
  nextGenButton.position(0,resetButton.height)
  nextGenButton.mousePressed(nextGen)
  nextGenButton=createButton("+")
  nextGenButton.position(0,resetButton.height*2)
  nextGenButton.mousePressed(scaleUp)
  nextGenButton=createButton("-")
  nextGenButton.position(0,resetButton.height*3)
  nextGenButton.mousePressed(scaleDown)
  
  reset()
  
}

function draw() {
  
  scale(myScale)
  
  //deal with dragging and dropping
  if(mp){
    cx=offsetX+mouseX/myScale
    cy=offsetY+mouseY/myScale
  }
  
  
  background(0)
  textSize(32)
  const spaceing=220;
  //myTree.draw(width/2-size/2,height-size,size)
  top3.trees[0].draw(width/2-size/2-spaceing+cx,height-size+cy,size)
  fill(255)
  stroke(0)
  text(top3.scores[0],width/2-size/2-spaceing+cx,height-size+cy+32*2)
  top3.trees[1].draw(width/2-size/2+cx,height-size+cy,size)
  fill(255)
  stroke(0)
  text(top3.scores[1],width/2-size/2+cx,height-size+cy+32*2)
  top3.trees[2].draw(width/2-size/2+spaceing+cx,height-size+cy,size)
  fill(255)
  stroke(0)
  text(top3.scores[2],width/2-size/2+spaceing+cx,height-size+cy+32*2)
  for(var i=0;i<20;i++){
    for(var j=0;j<5;j++){
      currentGeneration.generation[i+j*10].draw(width/2-size/2-spaceing+cx+spaceing*i,height-size+cy+500*(j+1),size)
      fill(255)
      stroke(0)
      text(currentGeneration.scores[i+j*10],width/2-size/2-spaceing+cx+spaceing*i,height-size+cy+500*(j+1)+32*2)
    }
  }
  
  scale(1/myScale)
}

function reset(){
  currentGeneration=new Population(100,0.9,0.5)
  top3=currentGeneration.getTopThree()
  print(currentGeneration)
  print(top3.scores)
}
function nextGen(){
  currentGeneration.produceNewGeneration()
  top3=currentGeneration.getTopThree()
}

function mousePressed(){
  mp=true
  offsetX=cx-mouseX/myScale
  offsetY=cy-mouseY/myScale
}
function mouseReleased(){
  mp=false
}

function scaleUp(){
  myScale=myScale*1.1
}
function scaleDown(){
  myScale=myScale/1.1
}
