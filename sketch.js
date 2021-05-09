var materialProperties={}
var simulationPerameters={}
var myTree={}
var myRandomTree={}
var currentGeneration={}

let resetButton,nextGenButton,tenGensButton,fiftyGensButton,plusButton,minusButton
let showAllCheckbox,showScoresCheckbox,showSupportsCheckbox
let populationSizeInput,initialMutationRateInput,mutationRateInput
var showAll=false
var showScores=false
var showSupports=false
var askew=true
let top3
var lastScores=[]

const size=30

var genSize=1000

var cx=0
var cy=0
var mp=false
var offX=0
var offY=0

var myScale=0.5
var targetScale=0.5

var completedGenerations=0
var targetGenerations=0

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
  nextGenButton.mousePressed(addGeneration)
  tenGensButton=createButton("10x")
  tenGensButton.position(nextGenButton.width,resetButton.height)
  tenGensButton.mousePressed(tenGens)
  fiftyGensButton=createButton("50x")
  fiftyGensButton.position(nextGenButton.width+tenGensButton.width,resetButton.height)
  fiftyGensButton.mousePressed(fiftyGens)
  plusButton=createButton("+")
  plusButton.position(0,resetButton.height*2)
  plusButton.mousePressed(scaleUp)
  minusButton=createButton("-")
  minusButton.position(plusButton.width,resetButton.height*2)
  minusButton.mousePressed(scaleDown)
  showAllCheckbox=createCheckbox("Show All",false)
  showAllCheckbox.changed(changeShowAll)
  showAllCheckbox.position(width,0)
  showScoresCheckbox=createCheckbox("Show Scores",false)
  showScoresCheckbox.changed(changeShowScores)
  showScoresCheckbox.position(width,showAllCheckbox.height)
  showSupportsCheckbox=createCheckbox("Show Supports",false)
  showSupportsCheckbox.changed(changeShowSupports)
  showSupportsCheckbox.position(width,showAllCheckbox.height+showScoresCheckbox.height)
  const secondMenuHeight=showAllCheckbox.height*4
  populationSizeInput=createInput("1000")
  populationSizeInput.position(width,secondMenuHeight)
  initialMutationRateInput=createInput("0.9")
  initialMutationRateInput.position(width,secondMenuHeight+populationSizeInput.height)
  mutationRateInput=createInput("0.01")
  mutationRateInput.position(width,secondMenuHeight+populationSizeInput.height*2)
  reset()
  
}

function draw() {
  if(abs(targetScale-myScale)>0.01){
    myScale=(targetScale-myScale)/10+myScale
  }
  
  background(0)
  
  
  
  scale(myScale)
  
  //deal with dragging and dropping
  if(mp){
    cx=offsetX+mouseX/myScale
    cy=offsetY+mouseY/myScale
  }
  
  textSize(32)
  const spaceing=500;
  //myTree.draw(width/2-size/2,height-size,size)
  top3.trees[0].draw(width/2-size/2-spaceing+cx,height-size+cy,size,showSupports)
  fill(255)
  stroke(0)
  text("1st",width/2-size/2-spaceing+cx,height-size+cy+32*2)
  if(showScores){
    text(int(top3.scores[0]*100)/100,width/2-size/2-spaceing+cx,height-size+cy+32*3)
  }
  top3.trees[1].draw(width/2-size/2+cx,height-size+cy,size,showSupports)
  fill(255)
  stroke(0)
  text("2st",width/2-size/2+cx,height-size+cy+32*2)
  if(showScores){
    text(int(top3.scores[1]*100)/100,width/2-size/2+cx,height-size+cy+32*3)
  }
  top3.trees[2].draw(width/2-size/2+spaceing+cx,height-size+cy,size,showSupports)
  fill(255)
  stroke(0)
  text("3rd",width/2-size/2+spaceing+cx,height-size+cy+32*2)
  if(showScores){
    text(int(top3.scores[2]*100)/100,width/2-size/2+spaceing+cx,height-size+cy+32*3)
  }
  if(showAll){
    for(var i=0;i<genSize;i++){
      //check if this can be skipped
      if(width/2-size/2-spaceing+cx+spaceing*(i%20)<0-size*10/myScale||
         width/2-size/2-spaceing+cx+spaceing*(i%20)>width/myScale||
        height-size+cy+500*(int(i/20)+1)<0||height-size+cy+500*(int(i/20)+1)>height/myScale+size*10/myScale){
        continue
      }
      const turn = 0.04*Math.sin(currentGeneration.scores[i])-0.02
      if(askew){
        translate(width/2-size/2-spaceing+cx+spaceing*(i%20),height-size+cy+500*(int(i/20)+1))
        rotate(turn)
        translate(-(width/2-size/2-spaceing+cx+spaceing*(i%20)),-(height-size+cy+500*(int(i/20)+1)))
      }
      currentGeneration.generation[i].draw(width/2-size/2-spaceing+cx+spaceing*(i%20),height-size+cy+500*(int(i/20)+1),size,showSupports)
      fill(255)
      if(showScores){
        stroke(0)
        text(int(currentGeneration.scores[i]*100)/100, width/2-size/2-spaceing+cx+spaceing*(i%20), height-size+cy+500*(int(i/20)+1)+32*2)
        }
      if(askew){
        translate(width/2-size/2-spaceing+cx+spaceing*(i%20),height-size+cy+500*(int(i/20)+1))
        rotate(-turn)
        translate(-(width/2-size/2-spaceing+cx+spaceing*(i%20)),-(height-size+cy+500*(int(i/20)+1)))
      }
    }
  }
  scale(1/myScale)
  
  textSize(64)
  fill(255)
  stroke(0)
  text(str(completedGenerations)+"/"+str(targetGenerations),width*2/5,64)
    
  //generations
  if(completedGenerations<targetGenerations){
    nextGen()
    completedGenerations+=1
  }
}

function reset(){
  genSize=int(populationSizeInput.value())
  currentGeneration=new Population(genSize,float(initialMutationRateInput.value()),float(mutationRateInput.value()))
  top3=currentGeneration.getTopThree()
  print(currentGeneration)
  print(top3.scores)
  completedGenerations=0
  targetGenerations=0
}
function nextGen(){
  currentGeneration.produceNewGeneration()
  top3=currentGeneration.getTopThree()
}
function addGeneration(){
  targetGenerations+=1
}
function tenGens(){
  targetGenerations+=10
}
function fiftyGens(){
  targetGenerations+=50
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
  targetScale=myScale*1.1
}
function scaleDown(){
  targetScale=myScale/1.1
}
function changeShowAll(){
  showAll=!showAll
}
function changeShowScores(){
  showScores=!showScores
}
function changeShowSupports(){
  showSupports=!showSupports
}
