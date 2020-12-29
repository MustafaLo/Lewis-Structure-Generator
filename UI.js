var UIController = (function(){
	var DOMstrings = {
		inputValue: "#input__formula",
		positiveCharge: "#positive-charge",
		negativeCharge: "#negative-charge"
	}

	var drawSingleBond = function(p, element, bond_positions){
		p.line(bond_positions[element][0], bond_positions[element][1], bond_positions[element][2], bond_positions[element][3])
	}

	var drawDoubleBond = function(p, element, bond_positions){
		p.angleMode(p.DEGREES)
		var angle = 360/bond_positions.length


		/*
		p.line(bond_positions[element][0] - 10, bond_positions[element][1], bond_positions[element][2] - 10, bond_positions[element][3])
		p.line(bond_positions[element][0] + 10, bond_positions[element][1] + 10 , bond_positions[element][2] + 10, bond_positions[element][3] + 10)
		*/
		
		
		/*


		
		p.line(bond_positions[element][0] + 10, bond_positions[element][1], bond_positions[element][2] + 10, bond_positions[element][3])
		p.line(bond_positions[element][0] - 10, bond_positions[element][1], bond_positions[element][2] - 10, bond_positions[element][3])
		*/
		

	
		p.line(bond_positions[element][0] + p.sin(angle * element) * 10, bond_positions[element][1] + p.cos(angle * element) * 10, bond_positions[element][2] + p.sin(angle * element) * 10, bond_positions[element][3] + p.cos(angle * element) * 10)

		p.line(bond_positions[element][0] - p.sin(angle * element) * 10, bond_positions[element][1] - p.cos(angle * element) * 10, bond_positions[element][2] - p.sin(angle * element) * 10, bond_positions[element][3] - p.cos(angle * element) * 10)
	
		
		
	}

	var drawTripleBond = function(p, element, bond_positions){
		return
	}


	return{

		getDOMStrings : function(){
			return DOMstrings;
		},

		getInput : function(){
			return document.querySelector(DOMstrings.inputValue).value
		},

		displayPositiveCharge: function(oldcharge,newcharge){
			document.querySelector(DOMstrings.inputValue).value = document.querySelector(DOMstrings.inputValue).value.replace(oldcharge, newcharge)
		},

		displayNegativeCharge: function(oldcharge, newcharge){
			document.querySelector(DOMstrings.inputValue).value = document.querySelector(DOMstrings.inputValue).value.replace(oldcharge, newcharge)
		},

		drawCentralAtom(p, centralAtom){
			p.textAlign(p.CENTER)
			p.text(centralAtom, (p.width/2), p.height/2)

		},

		drawOuterElements(p, elements){

			var positions = []

			p.angleMode(p.DEGREES)
			var angle = 360 / elements.length

			for(i = 0; i < elements.length; i++){

				var x = p.width/2 + p.cos(angle * i) * p.width/2
				var y = p.height/2 - p.sin(angle * i) * p.height/2

				if(x < 60)
					x = 60
				else if(p.width - x < 60)
					x = p.width - 60

				if(y < 60)
					y = 60
				else if(p.height - y < 60)
					y = p.height - 25
				

				p.text(elements[i].symbol, x, y)

				positions.push([x - p.cos(angle * i) * 30, y + p.sin(angle * i) * 25  + -15, p.width/2 + p.cos(angle * i) * 30, p.height/2 - p.sin(angle * i) * 25 + -15])

			}

			return positions
			
		},

		/*
		drawOuterLonePairs(p, elements){
			p.strokeWeight(7)

			p.angleMode(p.DEGREES)
			var angle = 360/elements.length

			for(i = 0; i < elements.length; i++){
				var x = p.width/2 + p.cos(angle * i) * p.width/2
				var y = p.height/2 - p.sin(angle * i) * p.height/2

				if(x < 60)
					x = 60
				else if(p.width - x < 60)
					x = p.width - 40

				if(y < 60)
					y = 60
				else if(p.height - y < 60)
					y = p.height - 30



				p.point(x,y)
			}


		},
		*/

		
		drawBonds(p, elements, bond_positions){
			p.strokeWeight(2)
			/*
			p.line(bond_positions[0][0], bond_positions[0][1], p.width/2, p.height/2)
			p.line(bond_positions[1][0], bond_positions[1][1], p.width/2 , p.height/2)
			p.line(bond_positions[2][0], bond_positions[2][1], p.width/2, p.height/2)
			p.line(bond_positions[3][0], bond_positions[3][1], p.width/2, p.height/2)
			p.line(bond_positions[4][0], bond_positions[4][1], p.width/2, p.height/2)
			*/

			/*
			p.line(bond_positions[0][0], bond_positions[0][1],bond_positions[0][2], bond_positions[0][3])
			p.line(bond_positions[1][0], bond_positions[1][1],bond_positions[1][2], bond_positions[1][3])
			p.line(bond_positions[2][0], bond_positions[2][1],bond_positions[2][2], bond_positions[2][3])
			p.line(bond_positions[3][0], bond_positions[3][1],bond_positions[3][2], bond_positions[3][3])
			p.line(bond_positions[4][0], bond_positions[4][1],bond_positions[4][2], bond_positions[4][3])
			*/


			for(var i = 0; i < elements.length; i++){
				if(elements[i].sharedElectrons == 2)
					drawSingleBond(p, i, bond_positions)
				else if(elements[i].sharedElectrons == 4)
					drawDoubleBond(p, i, bond_positions)
				else
					drawTripleBond(p, i, bond_positions)

			}

		}

	}

})()
