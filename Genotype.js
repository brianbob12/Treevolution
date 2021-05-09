//stores a list of all genes in a map
class Genotype{
  constructor(){
    this.sequence = new Map()
    this.defualtSpaceing=100
  }
  //location is a string contining co-ordinates
  //material is a string indicating the material in that location
  //"" for nothing
  addGene(location,material){
    if (material==""){
      //delete what's there
      if(this.sequence.get(location)!=undefined){
        this.sequence.delete(location);
      }
    }else{
      //add the material
      this.sequence.set(location,material);
    }
  }
  
  //get a list of possible locations for mutation
  mutate(){
    var mutable=[]
    
    //get levels and columns
    //sortGenotype into levels
    var levels={}//used like a map
    var levelKeys=[]
    var columns={}//used like a map
    var columnKeys=[]
    for(const gene of this.sequence.entries()){
      const splitLoc= gene[0].split(",")
      const x=float(splitLoc[0])
      const y=float(splitLoc[1])
      
      //add list if list not there
      if (levels[y]==undefined){
        levels[y]=[]
        levelKeys.push(y)
      }
      levels[y].push(gene)
      
      //add list if list not there
      if (columns[x]==undefined){
        columns[x]=[]
        columnKeys.push(x)
      }
      columns[x].push(gene)
      
      //add twice for balance
      mutable.push(gene[0])
      mutable.push(gene[0])
    }
    //sort level keys ascending
    levelKeys.sort((a,b)=>a-b)
    columnKeys.sort((a,b)=>a-b)
    
    //go through levels and expand up/down
    for(var i in levelKeys){
      if(i==0){
        //bottom
        for(const j in levels[levelKeys[i]]){
          const gene=levels[levelKeys[i]][j]
          const splitLoc=gene[0].split(",")
          const x=float(splitLoc[0])
          const y=float(splitLoc[1])
          //expand up
          if(this.sequence.get(str(x)+","+str(levelKeys[int(i)+1]))==undefined){
            //add twice for balance
            mutable.push(str(x)+","+str(levelKeys[int(i)+1]))
            mutable.push(str(x)+","+str(levelKeys[int(i)+1]))
          }
          //expand down
          if(this.sequence.get(str(x)+","+str(y-this.defualtSpaceing))==undefined){
            //add twice for balance
            mutable.push(str(x)+","+str(y-this.defualtSpaceing))
            mutable.push(str(x)+","+str(y-this.defualtSpaceing))
          }
          //expand between this level and the next
          const newLevel=y+(levelKeys[int(i)+1]-y)*Math.random()
          mutable.push(str(x)+","+str(newLevel))
        }
      }
      else{
        if(i==levelKeys.length-1){
          //top
          for(const j in levels[levelKeys[i]]){
            const gene=levels[levelKeys[i]][j]
            const splitLoc=gene[0].split(",")
            const x=float(splitLoc[0])
            const y=float(splitLoc[1])
            //expand down
            if(this.sequence.get(str(x)+","+str(levelKeys[int(i)-1]))==undefined){
              //add twice for balance
              mutable.push(str(x)+","+str(levelKeys[int(i)-1]))
              mutable.push(str(x)+","+str(levelKeys[int(i)-1]))
            }
            //expand up
            if(this.sequence.get(str(x)+","+str(y+this.defualtSpaceing))==undefined){
              //add twice for balance
              mutable.push(str(x)+","+str(y+this.defualtSpaceing))
              mutable.push(str(x)+","+str(y+this.defualtSpaceing))
            }
            //expand between this level and the previous
            const newLevel=y-(y-levelKeys[int(i)-1])*Math.random()
            mutable.push(str(x)+","+str(newLevel))
          }
        }
        else{
          //middle
          for(const j in levels[levelKeys[i]]){
            const gene=levels[levelKeys[i]][j]
            const splitLoc=gene[0].split(",")
            const x=float(splitLoc[0])
            const y=float(splitLoc[1])
            
            //expand up
            if(this.sequence.get(str(x)+","+str(levelKeys[int(i)+1]))==undefined){
              //add twice for balance
              mutable.push(str(x)+","+str(levelKeys[int(i)+1]))
              mutable.push(str(x)+","+str(levelKeys[int(i)+1]))
            }
            //expand between this level and the next
            const newLevel=y+(levelKeys[int(i)+1]-y)*Math.random()
            mutable.push(str(x)+","+str(newLevel))
            
            //expand down
            if(this.sequence.get(str(x)+","+str(levelKeys[int(i)-1]))==undefined){
              //add twice for balance
              mutable.push(str(x)+","+str(levelKeys[int(i)-1]))
              mutable.push(str(x)+","+str(levelKeys[int(i)-1]))
            }
            //expand between this level and the previous
            const newLevel2=y-(y-levelKeys[int(i)-1])*Math.random()
            mutable.push(str(x)+","+str(newLevel2))
          }
        }
      }
    }
    //go through columns and expand left/right
    for(var i in columnKeys){
      if(i==0){
        //leftmost
        for(const j in columns[columnKeys[i]]){
          const gene=columns[columnKeys[i]][j]
          const splitLoc=gene[0].split(",")
          const x=float(splitLoc[0])
          const y=float(splitLoc[1])
          //expand right
          if(this.sequence.get(str(columnKeys[int(i)+1])+","+str(y))==undefined){
            //add twice for balance
            mutable.push(str(columnKeys[int(i)+1])+","+str(y))
            mutable.push(str(columnKeys[int(i)+1])+","+str(y))
          }
          //expand left
          if(this.sequence.get(str(x-this.defaultSpaceing)+","+str(y))==undefined){
            //add twice for balance
            mutable.push(str(x-this.defaultSpaceing)+","+str(y))
            mutable.push(str(x-this.defaultSpaceing)+","+str(y))
          }
          //expand between this column and the next
          const newColumn=x+(columnKeys[int(i)+1]-y)*Math.random()
          mutable.push(str(newColumn)+","+str(y))
        }
      }
      else{
        if(i==columnKeys.length-1){
          //rightmost
          for(const j in columns[columnKeys[i]]){
            const gene=columns[columnKeys[i]][j]
            const splitLoc=gene[0].split(",")
            const x=float(splitLoc[0])
            const y=float(splitLoc[1])
            //expand left
            if(this.sequence.get(str(columnKeys[int(i)-1])+","+str(y))==undefined){
              //add twice for balance
              mutable.push(str(columnKeys[int(i)-1])+","+str(y))
              mutable.push(str(columnKeys[int(i)-1])+","+str(y))
            }
            //expand right
            if(this.sequence.get(str(x+this.defaultSpaceing)+","+str(y))==undefined){
              //add twice for balance
              mutable.push(str(x+this.defaultSpaceing)+","+str(y))
              mutable.push(str(x+this.defaultSpaceing)+","+str(y))
            }
            //expand between this column and the previous
            const newColumn=x+(x-columnKeys[int(i)-1])*Math.random()
            mutable.push(str(newColumn)+","+str(y))
          }
        }
        else{
          //middle
          for(const j in columns[columnKeys[i]]){
            const gene=columns[columnKeys[i]][j]
            const splitLoc=gene[0].split(",")
            const x=float(splitLoc[0])
            const y=float(splitLoc[1])
            
            //expand right
            if(this.sequence.get(str(columnKeys[int(i)+1])+","+str(y))==undefined){
              //add twice for balance
              mutable.push(str(columnKeys[int(i)+1])+","+str(y))
              mutable.push(str(columnKeys[int(i)+1])+","+str(y))
            }
            //expand between this column and the next
            const newColumn=x+(columnKeys[int(i)+1]-x)*Math.random()
            mutable.push(str(newColumn)+","+str(y))
            
            //expand left
            if(this.sequence.get(str(columnKeys[int(i)-1])+","+str(y))==undefined){
              //add twice for balance
              mutable.push(str(columnKeys[int(i)-1])+","+str(y))
              mutable.push(str(columnKeys[int(i)-1])+","+str(y))
            }
            //expand between this column and the previous
            const newColumn2=x+(x-columnKeys[int(i)-1])*Math.random()
            mutable.push(str(newColumn2)+","+str(y))
          }
        }
      }
    }
    //pick random gene to change
    //pick one of mutable
    const sel=Math.floor(Math.random()*mutable.length)
    
    //set sel to random material
    const materials=["Trunk","Leaves","Branch"]
    const newMaterial=materials[Math.floor(Math.random()*3)]
    this.sequence.set(mutable[sel],newMaterial)
    
  }
}