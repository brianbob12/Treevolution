class Tree{
  //phenotype
  constructor(genotype,materialProps,simulationPerameters,debug){
    this.genotype=genotype
    this.materialProps=materialProps
    this.simulationPerameters=simulationPerameters
    this.debug=debug!=undefined
    
    //mainsetup
    //get first draft of phenotype
    this.draftPhenotype()
    //console.log(this.phenotype)
    
    //remove unsupported blocks from the phenotype
    this.getSupports()
    
    this.structuallySound=true
    //prune unsupported components
    for(const loc in this.groundLevel){
      this.getLoad(this.groundLevel[loc])
    }
    
  }
  draw(cx,cy,size){
    const drawSupports=true
    for(const gene of this.phenotype.entries()){
      const splitLoc= gene[0].split(",")
      const x=int(splitLoc[0])
      const y=int(splitLoc[1])
      //draw the block
      fill(this.materialProps[gene[1]].color)
      stroke(0)
      rect(cx+size*x,cy-size*y,size,size)
      
    }
    for(const gene of this.phenotype.entries()){
      const splitLoc= gene[0].split(",")
      const x=int(splitLoc[0])
      const y=int(splitLoc[1])
      //draw supports
      if(drawSupports){
        const support=this.supports.get(gene[0])
        if(support!=undefined&&support!="G"){
          stroke(255,0,0)
          const supportSplit=support.split(",")
          line(cx+size*x+size/2,cy-   size*y+size/2, cx+size*int(supportSplit[0])+size/2, cy-size*int(supportSplit[1])+size/2)
        }
      }
    }
  }
   //a map showing everyGene's structure point
  getSupports(){
    //g for grounded
    this.supports=new Map()
    this.inverseSupport=new Map()//same as supports but inverted
    this.groundLevel=[]//used for later stuff
    this.survayQ={
      0:[],
      1:[],
      2:[],
      3:[],
      4:[],
      5:[]
    }
    for(const block of this.phenotype.entries()){
      const splitLoc= block[0].split(",")
      const x=float(splitLoc[0])
      const y=float(splitLoc[1])
      if(y==0){
        //add to ground level
        this.groundLevel.push(block[0])
        //set supported off ground
        this.supports.set(block[0],"G")
        //getSupports
        this.getSupportsOfBlock(block[0])
      }
    }
    //loop through survay Q
    while (true){
      if(this.survayQ[0][0]!=undefined){
        this.getSupportsOfBlock(this.survayQ[0][0])
        this.survayQ[0].splice(0,1)
        continue
      }
      if(this.survayQ[1][0]!=undefined){
        this.getSupportsOfBlock(this.survayQ[1][0])
        this.survayQ[1].splice(0,1)
        continue
      }
      if(this.survayQ[2][0]!=undefined){
        this.getSupportsOfBlock(this.survayQ[2][0])
        this.survayQ[2].splice(0,1)
        continue
      }
      if(this.survayQ[3][0]!=undefined){
        this.getSupportsOfBlock(this.survayQ[3][0])
        this.survayQ[3].splice(0,1)
        continue
      }
      if(this.survayQ[4][0]!=undefined){
        this.getSupportsOfBlock(this.survayQ[4][0])
        this.survayQ[4].splice(0,1)
        continue
      }
      if(this.survayQ[5][0]!=undefined){
        this.getSupportsOfBlock(this.survayQ[5][0])
        this.survayQ[5].splice(0,1)
        continue
      }
      break
    }
    
    //find unsupported blocks and remove them from the phenotype
    for( const block of this.phenotype.entries()){
      if(this.supports.get(block[0])==undefined&&block[0].split(",")[1]!="0"){
        this.phenotype.delete(block[0])
      }
    }
  }
  
  //requires getSupports
  getLoad(blocLoc){
    var load=this.materialProps[this.phenotype.get(blocLoc)].weight
    for(const loc in this.inverseSupport.get(blocLoc)){
      load+=this.getLoad(this.inverseSupport.get(blocLoc)[loc])
    }
    if(load>this.materialProps[this.phenotype.get(blocLoc)].support){
      if(this.debug){console.log(blocLoc+"\t"+load+"\tVIOLATION")}
      //TODO recursive prune
      this.structuallySound=false
    }
    else{
      //console.log(blocLoc+"\t"+load)
    }
    return load
  }
  //recrusive function
  getSupportsOfBlock(loc){
    const splitLoc=loc.split(",")
    const x=float(splitLoc[0])
    const y=float(splitLoc[1])
    const downLoc=str(x)+","+str(y-1)
    const upLoc=str(x)+","+str(y+1)
    const leftLoc=str(x-1)+","+str(y)
    const rightLoc=str(x+1)+","+str(y)
    
    //type is needed for prefrences
    const type=this.phenotype.get(loc)//trunk branch or leaves
    //these bools speed things up a bit
    const isTrunk=type=="Trunk"
    const isBranch=type=="Branch"
    
    const toCheck=[upLoc]
    
    //don't check things that are intrinsically supported
    if(y!=0){
      toCheck.push(leftLoc)
      toCheck.push(rightLoc)
      if(y!=1){
        toCheck.push(downLoc)
      }
    }
    
    for (const i in toCheck){
      if(this.isSupported(toCheck[i])){
        //check if this is supported off the target
        if(this.doesThisSupportThat(loc,toCheck[i],0)){
          //we can't redirect toCheck[i] becuase we are supported off it
          if(this.debug){console.log("Skipt\t"+toCheck[i]+"\t"+loc)}
          continue
        }
        
        //check prefrences
          //get the type of what's currently supporting it
          const competetor=this.phenotype.get(this.supports.get(toCheck[i]))
          if(competetor!="Trunk"){
            if(isTrunk){
              //we superseed this competetor
              //no need to recurse
              //remove the old support
              const listQ= this.inverseSupport.get(this.supports.get(toCheck[i]))
              var myIndex
              for(var j=0;j<listQ.length;j++){
                if(listQ[j]==toCheck[i]){
                  myIndex=j
                  break
                }
              }
              listQ.splice(myIndex,1)
                
              this.supports.set(toCheck[i],loc)
              if(this.debug){console.log("Attatching\t"+toCheck[i]+"\t"+loc)}
              if(this.inverseSupport.get(loc)==undefined){
                this.inverseSupport.set(loc,[])
              }
              this.inverseSupport.get(loc).push(toCheck[i])
            }
            else if(competetor=="Leaves"&&isBranch){
              //we superseed this competetor
              //no need to recurse
              //remove the old support
              const listQ= this.inverseSupport.get(this.supports.get(toCheck[i]))
              var myIndex
              for(var j=0;j<listQ.length;j++){
                if(listQ[j]==toCheck[i]){
                  myIndex=j
                  break
                }
              }
              listQ.splice(myIndex,1)
                
              this.supports.set(toCheck[i],loc)
              if(this.debug){console.log("Attatching\t"+toCheck[i]+"\t"+loc)}
              if(this.inverseSupport.get(loc)==undefined){
                this.inverseSupport.set(loc,[])
              }
              this.inverseSupport.get(loc).push(toCheck[i])
            }
          }
          if(competetor==type){//if the same type
            //check if the block being tested is direclty above
            if(toCheck[i]==upLoc){
              //replace
              //no need to recurse
              //remove the old support
              const listQ= this.inverseSupport.get(this.supports.get(toCheck[i]))
              var myIndex
              for(var j=0;j<listQ.length;j++){
                if(listQ[j]==toCheck[i]){
                  myIndex=j
                  break
                }
              }
              listQ.splice(myIndex,1)
                
              this.supports.set(toCheck[i],loc)
              if(this.debug){console.log("Attatching\t"+toCheck[i]+"\t"+loc)}
              if(this.inverseSupport.get(loc)==undefined){
                this.inverseSupport.set(loc,[])
              }
              this.inverseSupport.get(loc).push(toCheck[i])
            }
          }
        }
        else{
          //It's not supported
          //check that there is actually something there
          if(this.phenotype.get(toCheck[i])!=undefined){
            //attach it to this
            this.supports.set(toCheck[i],loc)
            if(this.debug){console.log("Attatching\t"+toCheck[i]+"\t"+loc)}
            if(this.inverseSupport.get(loc)==undefined){
              this.inverseSupport.set(loc,[])
            }
            this.inverseSupport.get(loc).push(toCheck[i])

            //add toCheck[i] to the q
            //put in correct priority
            const up=i==0
            const block=this.phenotype.get(toCheck[i])
            if(block=="Trunk"){
              if(up){
                this.survayQ[0].push(toCheck[i])
              }
              else{
                this.survayQ[1].push(toCheck[i])
              }
            }
            else if(block=="Branch"){
              if(up){
                this.survayQ[2].push(toCheck[i])
              }
              else{
                this.survayQ[3].push(toCheck[i])
              }
            }
            else if(block=="Leaves"){
              if(up){
                this.survayQ[4].push(toCheck[i])
              }
              else{
                this.survayQ[5].push(toCheck[i])
              }
            }
          }
        }
      }
    }
  
  
  isSupported(location){
    //check if location is supported
    const type=this.phenotype.get(location)
    if(type!=undefined){
      const mySupport = this.supports.get(location)
      if(mySupport!=undefined){
        return true
      }
    }
    return false
  }
  
  //recursive
  doesThisSupportThat(loc,locP,c){
    if(this.debug){console.log("Checking\t"+loc+"\t"+locP)}
    //TODO replace 20 with the number of blocks in the phenotype
    if(c>60){
      console.log("Something has gone wrong A")
      return true
    }
    if(loc==locP){
      return true
    }
    else{
      const nextSupport=this.supports.get(loc)
      if(this.debug&&(nextSupport==undefined||nextSupport==loc)){
        //something has gone wrong
        console.log("Something has gone wrong B")
        console.log(loc+"\t"+locP)
        return true
      }
      else if(nextSupport=="G"){
        //g for ground
        return false
      }
      else{
        return this.doesThisSupportThat(nextSupport,locP,c+1)
      }
    }
  }
  
  getScore(){
    //get costs
    var totalNetEnergy=0
    
    //leaf heihg tscore
    var leafHeightScore=0
    
    //store levels for leaves
    var levels={}//used like a map
    var maxLevel=0;
    for(const gene of this.phenotype.entries()){
      const splitLoc= gene[0].split(",")
      const x=int(splitLoc[0])
      const y=int(splitLoc[1])
      
      //add list if list not there
      if (levels[y]==undefined){
        levels[y]=[]
      }
      levels[y].push(gene[0])
      if(y>maxLevel){
        maxLevel=y
      }
      
      //add cost
      totalNetEnergy+=this.materialProps[gene[1]].netEnergy
    }
    
    //map for sunlight
    //maps x cord to remaining sunlight
    //if undefined assume full sunlight
    var sunlight={}
    //iterate backwards through layers
    for(var i = maxLevel;i>=0;i--){
      for(var block in levels[i]){
        if(this.phenotype.get(levels[i][block])=="Leaves"){
          const column=int(levels[i][block].split(",")[0])
          //add leaf height score
          leafHeightScore += this.simulationPerameters["leafHeightScore"] ^ int(levels[i][block].split(",")[1]) -1
          if(sunlight[column]==undefined){
            sunlight[column]=this.simulationPerameters["sunIntensity"] * (1-this.materialProps["Leaves"].photo)
            //add energy
            totalNetEnergy += this.simulationPerameters["sunIntensity"] * this.materialProps["Leaves"].photo
          }
          else{
            //add energy
            totalNetEnergy += sunlight[column] * this.materialProps["Leaves"].photo
            //take remaining energy
            sunlight[column]=sunlight[column] * (1-this.materialProps["Leaves"].photo)
            
          }
        }
      }
    }
    if(totalNetEnergy<0){
      totalNetEnergy=0
    }
    this.score=totalNetEnergy+leafHeightScore
    if(this.score<0){
      return 0
    }
    return this.score
  }
          
  
  
  //turns the genotype into a rough layout of blocks
  draftPhenotype(){
    //sortGenotype into levels
    var levels={}//used like a map
    var levelKeys=[]
    var myPhenotype=new Map()
    for(const gene of this.genotype.sequence.entries()){
      const splitLoc= gene[0].split(",")
      const x=float(splitLoc[0])
      const y=float(splitLoc[1])
      
      //add list if list not there
      if (levels[y]==undefined){
        levels[y]=[]
        levelKeys.push(y)
      }
      levels[y].push(gene)
    }
    //sort level keys ascending
    levelKeys.sort((a,b)=>a-b)
    //go through levels and add to phenotype
    for(var i=0;i<levelKeys.length;i++){
      for(const gene in levels[levelKeys[i]]){
        const splitLoc= levels[levelKeys[i]][gene][0].split(",")
        const x=float(splitLoc[0])
        myPhenotype.set(str(x)+","+str(i),levels[levelKeys[i]][gene][1])
      }
    }
    //new repeat for columns
    var columns={}//used like a map
    var columnKeys=[]
    var myNextPhenotype=new Map()
    for(const gene of myPhenotype.entries()){
      const splitLoc= gene[0].split(",")
      const x=float(splitLoc[0])
      const y=float(splitLoc[1])
      
      //add list if list not there
      if (columns[x]==undefined){
        columns[x]=[]
        columnKeys.push(x)
      }
      columns[x].push(gene)
    }
    //sort level keys ascending
    columnKeys.sort((a,b)=>a-b)
    //go through levels and add to phenotype
    for(var i=0;i<columnKeys.length;i++){
      for(const gene in columns[columnKeys[i]]){
        const splitLoc= columns[columnKeys[i]][gene][0].split(",")
        const y=float(splitLoc[1])
        myNextPhenotype.set(str(i)+","+str(y),columns[columnKeys[i]][gene][1])
      }
    }
    this.phenotype=myNextPhenotype
  }

}