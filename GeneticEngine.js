function randomTree(mutationChance,breakThresh){
  var newGenotype=new Genotype()
  var newTree={}
  var c=0
  const materials=["Trunk","Leaves","Branch"]
  while(true){
    newGenotype=new Genotype()
    newGenotype.addGene("0,0","Trunk")
    newGenotype.addGene("0,100","Trunk")
    newGenotype.addGene("0,200","Leaves")
    newGenotype.addGene("-100,100","Leaves")
    newGenotype.addGene("100,100","Leaves")
    c+=1
    while(true){
      if(Math.random()<=1-mutationChance){
        break
      }
      else{
        newGenotype.mutate()
      }
    }
    
    newTree=new Tree(newGenotype,materialProperties,simulationPerameters)
    if(newTree.structuallySound){
      break
    }
    if(c>breakThresh){
      console.log("ABORTED")
      break
    } 
  }
  //temporary
  return newTree
}
    
//takes two genotypes and makes a new tree    
function babyTree( treeAGenotype, treeBGenotype ,mutationChance, breakThresh){
  var newGenotype=new Genotype()
  var newTree={}
  var c=0
  const materials=["Trunk","Leaves","Branch"]
  while(true){
    c+=1
    //start with blank genotype
    newGenotype=new Genotype()

    //cross Genes
    
    var locs=[]
    for(const gene of treeAGenotype.sequence.entries()){
      locs.push(gene[0])
    }
    for(const gene of treeBGenotype.sequence.entries()){
      if(!locs.includes(gene[0])){
        locs.push(gene[0])
      }
    }
    for(const i in locs){
      if(Math.random()<0.5){//50% chance
        //inherit from treeA
        const newGene=treeAGenotype.sequence.get(locs[i])
        if(newGene!=undefined){
          newGenotype.addGene(locs[i],newGene)
        }
      }
      else{
        //inherit from treeB
        const newGene=treeBGenotype.sequence.get(locs[i])
        if(newGene!=undefined){
          newGenotype.addGene(locs[i],newGene)
        }
      }
    }
    
    //The rest of this is to do with mutation
    
    while(true){
      if(Math.random()<=1-mutationChance){
        break
      }
      else{
        newGenotype.mutate()
      }
    }
    newTree=new Tree(newGenotype,materialProperties,simulationPerameters)
    if(newTree.structuallySound){
      break
    }
    if(c>breakThresh){
      console.log("ABORTED")
      return undefined
      break
    } 
  }
  //temporary
  return newTree
}