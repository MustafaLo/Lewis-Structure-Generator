var LewisStructureController = (function (){

	//Lewis Structure object with list of elements, total valence electrons, a central atom, ans charge
	var LewisStructure = {
		elements: [],
		totalValence: 0,
		centralAtom: '',
		charge: ''
	}	

	//Formula object with list of element symbols, subscripts (no duplicates C2 => [C]), a charge type (+ or -), and the charge itself
	var formula = {
		elementSymbols : [],
		elementSubscripts : [],
		chargeType: '',
		charge: 0
	}

	//Element constructor
	var Element = function(name, symbol, period, electronegativity, valence, subscript){
		this.name = name
		this.symbol = symbol
		this.period = period
		this.electronegativity = electronegativity
		this.valence = valence
		this.subscript = subscript
		this.sharedElectrons = 0
		this.loneElectrons = 0
	}

	//Checks if the element is satisfied (in terms of electrons)
	Element.prototype.isSatisfied = function(){
		//If the element is Hydrogen, its lone electrons and shared electrons must add to 2
		if(this.name == "Hydrogen"){
			if(this.loneElectrons + this.sharedElectrons == 2)
				return true
		}

		//If the element is Beryllium, its lone electrons and shared electrons must add to 4
		else if(this.name == "Beryllium"){
			if(this.loneElectrons + this.sharedElectrons < 4)
				return "more lone electrons"
			else if(this.loneElectrons + this.sharedElectrons > 4)
				return "less lone electrons"
			else 
				return true
		}

		//If the element is Boron, its lone electrons and shared electrons must add to 6
		else if(this.name == "Boron"){
			if(this.loneElectrons + this.sharedElectrons < 6)
				return "more lone electrons"
			else if(this.loneElectrons + this.sharedElectrons > 6)
				return "less lone electrons"
			else 
				return true
		}

		//With any other element, its lone electrons and shared electrons must add to 8 (octet rule)
		else{
			if(this.loneElectrons + this.sharedElectrons < 8)
				return "more lone electrons"
			else if(this.loneElectrons + this.sharedElectrons > 8)
				return "less lone electrons"
			else 
				return true
		}

		return false
	}

	//Satisfies the given element BASED ON AMOUNT OF SHARED ELECTRONS PASSED
	/*Ex. 
		  Nitrogen.satisfy(2) (single bond) => Lone Electrons: 6, Shared Electrons: 2
		  Nitrogen.satisfy(4) (double bond) => Lone Electrons: 4, Shared Electrons: 4
		  Nitrogen.satisfy(6) (triple bond) => Lone Electrons: 2, Shares Electrons: 6
	*/
	Element.prototype.satisfy = function(sharedE) {
		//Set the element's attribute of shared electrons to the amount passed
		this.sharedElectrons = sharedE

		//Hydrogen does not have lone electrons so, in order to satisfy it, subtract from its shared electrons
		if(this.name == "Hydrogen"){
			while(!this.isSatisfied())
				this.sharedElectrons --
		}

		else{
			//While the element is not satisfied
			while(this.isSatisfied() != true){
				//Increase the amount of electrons
				if(this.isSatisfied() == "more lone electrons")
					this.loneElectrons ++
				//Decrease the amount of electrons
				else if(this.isSatisfied() == "less lone electrons")
					this.loneElectrons --
			}

		}
	}

	//Returns the element that has the least subscript
	var findLeastSubscriptElement = function(){
		var leastSubscript = LewisStructure.elements[0]
		for(i = 1; i < LewisStructure.elements.length; i++){
			if(LewisStructure.elements[i].subscript < leastSubscript.subscript)
				leastSubscript = LewisStructure.elements[i]
				
		}

		return leastSubscript		
	}

	//Returns the element that has the least electronegativity
	var findLeastElectronegativeElement = function(){
		var leastElectronegativity = LewisStructure.elements[0]
		for(i = 1; i < LewisStructure.elements.length; i++){
			if(LewisStructure.elements[i].electronegativity < leastElectronegativity.electronegativity)
				leastElectronegativity = LewisStructure.elements[i]
		}

		return leastElectronegativity
	}

	//Creates a "skeletal" Lewis Structure with ONLY single bonds
	var createSkeletalStructure = function(){
		for(i = 0; i < LewisStructure.elements.length; i++){
			if(LewisStructure.elements[i] != LewisStructure.centralAtom)
				//Satisfy ONLY with a single bond (2 shared electrons)
				LewisStructure.elements[i].satisfy(2)
		
		}
	}

	//Returns the current total electrons of all the elements
	var getCurrentTotalElectrons = function(){
		var currentTotalElectrons = 0
		for(i = 0; i < LewisStructure.elements.length; i++){
			currentTotalElectrons += LewisStructure.elements[i].loneElectrons + LewisStructure.elements[i].sharedElectrons
		}
		return currentTotalElectrons
	}

	/*Checks whether the CENTRAL ATOM is satisfied:
		1) Adds ALL the shared electrons of the elements (except central atom)
		2) Temporarily set the central atom shared electrons attribute to the total shared electrons
		3) Check whether the central atom is satisfied (lone electrons and total shared electrons)
		4) Set the central atom shared electrons attribute back to 0
	*/

	var isCentralAtomSatisfied = function(){
		var currentTotalSharedElectrons = 0

		//Add up all shared electrons
		for(i = 0; i < LewisStructure.elements.length; i++)
			currentTotalSharedElectrons += LewisStructure.elements[i].sharedElectrons

		LewisStructure.centralAtom.sharedElectrons = currentTotalSharedElectrons

		var temp = LewisStructure.centralAtom.isSatisfied()
		LewisStructure.centralAtom.sharedElectrons = 0

		
		if(temp == "less lone electrons" && LewisStructure.centralAtom.period >= 3)
			return true
		else
			return temp		
	}



	return{
		//Resets the Lewis Structure and formula object
		setDefault : function(){
			LewisStructure.elements = []
			LewisStructure.totalValence = 0
			LewisStructure.centralAtom = null
			LewisStructure.charge = null

			formula.elementSymbols = []
			formula.elementSubscripts = []
			formula.charge = null
			formula.chargeType = null
		},	

		//Checks if user entered a valid formula (based on regex) and extracts element symbols / subscripts
		evaluateFormula: function(input){
			const regex = /(\(([\+\-])(\d)\))?([A-Z][a-z]?)(\d*)?/g


			if(input.match(regex) == null)
				return false

			let matches
			while((matches = regex.exec(input)) != null){
				matches.forEach((match, groupIndex) =>{
					if(match != null){
						if(groupIndex == 5)
							formula.elementSubscripts.push(parseInt(match))
						else if(groupIndex == 4)
							formula.elementSymbols.push(match)
						else if(groupIndex == 3)
							formula.charge = parseInt(match)
						else if(groupIndex == 2)
							formula.chargeType = match
					}

					else if(groupIndex == 5){
						formula.elementSubscripts.push(1)
					}

				})
			}
			
			return true
		},

		//Creates element object for each element symbol inside the formula object
		getElements : function(){
			formula.elementSymbols.forEach((symbol,index) =>{
				Periodic_Table["elements"].forEach((element) =>{
					if(formula.elementSymbols[index] == element.symbol){

						//Creates number of elements based on subscript
						//Ex. C2 => [C, C]
						for(i = 0; i < formula.elementSubscripts[index]; i++){
							LewisStructure.elements.push(new Element(
							element.name,
							element.symbol,
							element.period,
							element.electronegativity_pauling,
							element.shells[element.shells.length - 1],
							formula.elementSubscripts[index]
							))	
						}

					}

				})
			})
		},


		getTotalValence: function(){
			LewisStructure.elements.forEach((element) => {
				LewisStructure.totalValence += element.valence
			})

			if(formula.chargeType == "+")
				LewisStructure.totalValence -= formula.charge

			else if(formula.chargeType == "-")
				LewisStructure.totalValence += formula.charge

			LewisStructure.charge = formula.chargeType + formula.charge
		},

		//Determine the central atom of the Lewis Structure
		getCentralAtom: function(){

			//If Carbon is present in the molecule, it is automatically the central atom
			for(i = 0; i < LewisStructure.elements.length; i++){
				if(LewisStructure.elements[i].name == "Carbon"){
					LewisStructure.centralAtom = LewisStructure.elements[i]
					return
				}
			}

			//If there is no least subscript present, central atom will be the least electronegative element
			for(i = 0; i < formula.elementSubscripts.length; i++){
				if(formula.elementSubscripts[i] == formula.elementSubscripts[i + 1]){
					LewisStructure.centralAtom = findLeastElectronegativeElement()
					return 

				}	
			}

			LewisStructure.centralAtom = findLeastSubscriptElement()
	
		},

		/*
			1) First create a skeletal structure outline of the Lewis Structure
			2) While the current total electrons are STILL less than the total valence electrons the Lewis 			   Structure is supposed to have, increase the lone electrons on the central atom (this is called a 	   sigma structre.)
			3) While the central atom is still not satisfied, loop through each of the elements in the list and 	   satisfy them with 4 shared electrons (double bonds), then 6 shared electrons (triple bonds)
			   		a) For loop with potential shared electrons AS 4
			   		b) Loop through each of the elements of Lewis Structure (excluding central atom)
			   		c) If the central atom isn't satisfied, satisfy the current element with the potential shared 	   electons
		*/
		getBonds: function(){
			createSkeletalStructure()

			while(getCurrentTotalElectrons() < LewisStructure.totalValence)
				LewisStructure.centralAtom.loneElectrons++

			for(var potentialSharedElectrons = 4; potentialSharedElectrons <= 6; potentialSharedElectrons += 2){
				for(var i = 0; i < LewisStructure.elements.length; i++){
					if(LewisStructure.elements[i] != LewisStructure.centralAtom){

						if(isCentralAtomSatisfied() == true)
							return
						else
							LewisStructure.elements[i].satisfy(potentialSharedElectrons)
	
					}
					
				}
			}
			
		},

		getLewisStructureData : function(){
			return LewisStructure
		},

		testing: function(){
			console.log(formula)
			console.log(LewisStructure)
		}
		
	}	


})();







