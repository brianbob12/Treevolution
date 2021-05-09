class Population{
  constructor(genSize,startingMutationRate,mutationRate){
    this.genSize=genSize
    this.mutationRate=mutationRate
    //generate first generation
    this.generation=[]
    this.scores=[]
    for(var i=0;i<genSize;i++){
      var newTree=randomTree(startingMutationRate,10000)
      if(newTree==undefined){
        //I don't know what to do here
      }
      else{
        this.generation.push(newTree)
        this.scores.push(newTree.getScore())
      }
    }
  }
  
  weightedRandom(weights){
    var cumulativeWeights=[]
    var cumulativeTracker=0
    for(const weight in weights){
      cumulativeTracker+=weights[weight]
      cumulativeWeights.push(cumulativeTracker)
    }
    const selected=Math.floor(Math.random()*cumulativeTracker)
    for(const weight in weights){
      if(selected<=cumulativeWeights[weight]){
        return weight
      }
    }
  }
  
  getTopThree(){
    var worst=0
    for(const score in this.scores){
      if(this.scores[score]<this.scores[worst]){
        worst=score
      }
    }
    
    var first=worst
    var sec=worst
    var third=worst
    for(const score in this.scores){
      if(this.scores[score]>this.scores[third]){
        if(this.scores[score]>this.scores[sec]){
          if(this.scores[score]>this.scores[first]){
            third=sec
            sec=first
            first=score
          }
          else{
            third=sec
            sec=score
          }
        }
        else{
          third=score
        }
      }
    }
    return ({
      "trees":[this.generation[first], this.generation[sec], this.generation[third]],
      "scores":[this.scores[first],this.scores[sec],this.scores[third]]
    })
  }
  produceNewGeneration(){
    var newGeneration=[]
    for(var i=0;i<this.genSize;i++){
      //pick two parents
      const p1=this.generation[this.weightedRandom(this.scores)]
      const p2=this.generation[this.weightedRandom(this.scores)]
      //self breeding allowed
      newGeneration.push(babyTree(p1.genotype,p2.genotype,this.mutationRate,1000))
    }
    //set current generation to this new gen
    this.generation=newGeneration
    this.scores=[]
    for(var i=0;i<this.genSize;i++){
      this.scores.push(this.generation[i].getScore())
    }
  }
}