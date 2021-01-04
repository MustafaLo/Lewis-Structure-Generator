var controller = (function(LSCtrl, UICtrl){
	var setUpEventListeners = function(){
		var DOM = UICtrl.getDOMStrings()

		var pcharge = 0;
		var ncharge = 0;

		document.querySelector(DOM.positiveCharge).addEventListener('click', function(){
			var input = UICtrl.getInput()

			if(input.includes("(-" + ncharge + ")")){
				pcharge = 1
				UICtrl.displayPositiveCharge("(-" + ncharge + ")", "(+" + pcharge + ")")
			}

			else if(input.includes("(+" + pcharge + ")")){
				pcharge++
				UICtrl.displayPositiveCharge("(+" + (pcharge - 1) + ")", "(+" + pcharge + ")")
			}

			else{
				pcharge = 1
				UICtrl.displayPositiveCharge("", "(+" + pcharge + ")")
			}


			
		})

		document.querySelector(DOM.negativeCharge).addEventListener('click', function(){
			var input = UICtrl.getInput()

			if(input.includes("(+" + pcharge + ")")){
				ncharge = 1
				UICtrl.displayNegativeCharge("(+" + pcharge + ")", "(-" + ncharge + ")")
			}

			else if(input.includes("(-" + ncharge + ")") && !input.includes("(+" + pcharge + ")")){
				ncharge++
				UICtrl.displayNegativeCharge("(-" + (ncharge - 1) + ")", "(-" + ncharge + ")")
			}
			else{
				ncharge = 1
				UICtrl.displayNegativeCharge("", "(-" + ncharge + ")")
			}

			
		})

		document.addEventListener('keypress', function(event){
			if(event.keyCode == 13){
				LSCtrl.setDefault()
				IntializeLewisStructure()
				DrawLewisStructure()
				UICtrl.setInput("")
			}

		})
		

	}

	var IntializeLewisStructure = function(){
		var input

		input = UICtrl.getInput();

		//Add check function to determine if user entered valid formula
		if(input != "" && LSCtrl.evaluateFormula(input)){
			LSCtrl.getElements()
			LSCtrl.getTotalValence()
			LSCtrl.getCentralAtom()
			LSCtrl.getBonds()

		}	

		LSCtrl.testing()
	}

	var DrawLewisStructure = function(){
		var LewisStructure = LSCtrl.getLewisStructureData()

		var sketch = function(p){
			p.setup = function(){
				p.createCanvas(500,500).position(300,100)
				p.textSize(40)
			}

			p.draw = function(){
				p.background(255,255,255)
				var outerelements = LewisStructure.elements.filter(function(element){ return element !=LewisStructure.centralAtom})
				var angle = 360/outerelements.length
				UICtrl.drawOuterElements(p, outerelements, angle)
				UICtrl.drawBonds(p, outerelements)
				UICtrl.drawOuterLonePairs(p, outerelements)
				UICtrl.drawCentralAtom(p, LewisStructure.centralAtom.symbol, angle)
				UICtrl.drawCentralLonePairs(p, LewisStructure.centralAtom, angle)
				UICtrl.drawCharge(p, LewisStructure.charge)
				UICtrl.clearPositions()
				
			}
		}

		var myp5 = new p5(sketch)
	}





	



	return {
		init: function(){
			setUpEventListeners()
		}
	}

})(LewisStructureController, UIController);

controller.init()





