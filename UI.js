var UIController = (function(){
	var DOMstrings = {
		inputValue: "#input__formula",
		positiveCharge: "#positive-charge",
		negativeCharge: "#negative-charge"
	}

	var positions = {
		bonds : [],
		lonepairs: {
			top: [],
			bottom: [],
			r_side: [],
			l_side: [],
			centralAtom : []
		}
				
	}	

	var drawSingleBond = function(p, element){
		p.line(positions.bonds[element][0], positions.bonds[element][1], positions.bonds[element][2], positions.bonds[element][3])
	}

	var drawDoubleBond = function(p, element, angle){
		p.angleMode(p.DEGREES)
	
		p.line(positions.bonds[element][0] + p.sin(angle * element) * 10, positions.bonds[element][1] + p.cos(angle * element) * 10, positions.bonds[element][2] + p.sin(angle * element) * 10, positions.bonds[element][3] + p.cos(angle * element) * 10)

		p.line(positions.bonds[element][0] - p.sin(angle * element) * 10, positions.bonds[element][1] - p.cos(angle * element) * 10, positions.bonds[element][2] - p.sin(angle * element) * 10, positions.bonds[element][3] - p.cos(angle * element) * 10)
	}

	var drawTripleBond = function(p, element, angle){
		p.angleMode(p.DEGREES)

		p.line(positions.bonds[element][0] + p.sin(angle * element) * 20, positions.bonds[element][1] + p.cos(angle * element) * 20, positions.bonds[element][2] + p.sin(angle * element) * 20, positions.bonds[element][3] + p.cos(angle * element) * 20)
		
		p.line(positions.bonds[element][0], positions.bonds[element][1], positions.bonds[element][2], positions.bonds[element][3])

		p.line(positions.bonds[element][0] - p.sin(angle * element) * 20, positions.bonds[element][1] - p.cos(angle * element) * 20, positions.bonds[element][2] - p.sin(angle * element) * 20, positions.bonds[element][3] - p.cos(angle * element) * 20)
	}

	var drawTopLonePairs = function(p, element){
		if(positions.lonepairs.top[element] == null)
			return
		else{
			p.point(positions.lonepairs.top[element][0] + 7, positions.lonepairs.top[element][1])
			p.point(positions.lonepairs.top[element][0] - 7, positions.lonepairs.top[element][1])
		}
	}

	var drawBottomLonePairs = function(p, element){
		if(positions.lonepairs.bottom[element] == null)
			return
		else{
			p.point(positions.lonepairs.bottom[element][0] + 7, positions.lonepairs.bottom[element][1])
			p.point(positions.lonepairs.bottom[element][0] - 7, positions.lonepairs.bottom[element][1])
		}
	}

	var drawRightLonePairs = function(p, element){
		if(positions.lonepairs.r_side[element] == null)
			return
		else{
			p.point(positions.lonepairs.r_side[element][0], positions.lonepairs.r_side[element][1] + 7)
			p.point(positions.lonepairs.r_side[element][0], positions.lonepairs.r_side[element][1] - 7)
		}
	}

	var drawLeftLonePairs = function(p, element){
		if(positions.lonepairs.l_side[element] == null)
			return
		else{
			p.point(positions.lonepairs.l_side[element][0], positions.lonepairs.l_side[element][1] + 7)
			p.point(positions.lonepairs.l_side[element][0], positions.lonepairs.l_side[element][1] - 7)
		}
	}


	return{

		getDOMStrings : function(){
			return DOMstrings;
		},

		getInput : function(){
			return document.querySelector(DOMstrings.inputValue).value
		},

		setInput: function(string){
			document.querySelector(DOMstrings.inputValue).value = string
		},

		displayPositiveCharge: function(oldcharge,newcharge){
			document.querySelector(DOMstrings.inputValue).value = document.querySelector(DOMstrings.inputValue).value.replace(oldcharge, newcharge)
		},

		displayNegativeCharge: function(oldcharge, newcharge){
			document.querySelector(DOMstrings.inputValue).value = document.querySelector(DOMstrings.inputValue).value.replace(oldcharge, newcharge)
		},

		drawCentralAtom(p, centralAtom, angle){
			p.textAlign(p.CENTER)
			p.angleMode(p.DEGREES)
			p.text(centralAtom.symbol, (p.width/2), p.height/2)

			if(angle >= 360)
				angle = 90

			for(i = 0; i < centralAtom.loneElectrons; i++)
				positions.lonepairs.centralAtom.push([p.cos(angle * i) * 25, p.sin(angle * i) * -25])
		},

		drawOuterElements(p, elements, angle){
			p.angleMode(p.DEGREES)
			p.strokeWeight(6)

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
					y = p.height - 30

				p.text(elements[i].symbol, x, y)

				positions.bonds.push([x - p.cos(angle * i) * 30, y + p.sin(angle * i) * 25  + -15, p.width/2 + p.cos(angle * i) * 30, p.height/2 - p.sin(angle * i) * 25 + -15])

				p.sin(angle * i) > -0.5 ? positions.lonepairs.top.push([x, y - 40]) : positions.lonepairs.top.push(null)
				p.sin(angle * i) < 0.5 ? positions.lonepairs.bottom.push([x, y + 10]) : positions.lonepairs.bottom.push(null)
				p.cos(angle * i) > -1 ? positions.lonepairs.r_side.push([x + 25, y - 15]) : positions.lonepairs.r_side.push(null)
				p.cos(angle * i) < 1 ? positions.lonepairs.l_side.push([x - 25, y - 15]) : positions.lonepairs.l_side.push(null)
			}
			
		},

		drawOuterLonePairs(p, elements){
			p.strokeWeight(6)
			for(i = 0; i < elements.length; i++){
				var lone_electrons = elements[i].loneElectrons
				if(lone_electrons >= 2)
					drawTopLonePairs(p, i)
				if(lone_electrons >= 4)
					drawBottomLonePairs(p, i)
				if(lone_electrons >= 6){
					drawRightLonePairs(p, i)
					drawLeftLonePairs(p, i)
				}
			}



		},

		drawCentralLonePairs(p, centralAtom, angle){
			p.push()
			p.translate(p.width/2, p.height/2 - 15)
			if(angle >= 360)
				angle = 180

			var loneElectrons = centralAtom.loneElectrons

			for(i = 0; i < positions.lonepairs.centralAtom.length; i++){
				if(loneElectrons == 0){
					p.pop()
					return
				}
				else{
					let rotation = -1 * angle/2

					p.push()
					p.rotate(rotation + 20)
					p.point(positions.lonepairs.centralAtom[i][0], positions.lonepairs.centralAtom[i][1])
					p.pop()

					p.push()
					p.rotate(rotation - 20)
					p.point(positions.lonepairs.centralAtom[i][0], positions.lonepairs.centralAtom[i][1])
					p.pop()

					loneElectrons -= 2
				}
			}

		},
		
		drawBonds(p, elements){
			p.strokeWeight(2)
			for(i = 0; i < elements.length; i++){
				if(elements[i].sharedElectrons == 2)
					drawSingleBond(p, i)
				else if(elements[i].sharedElectrons == 4)
					drawDoubleBond(p, i, 360/elements.length)
				else
					drawTripleBond(p, i, 360/elements.length)

			}

		},

		drawCharge(p, charge){
			if(charge != 0)
				p.text(charge, p.width - 45, 45)
		},

		clearPositions(){
			positions.bonds = []
			positions.lonepairs.top = []
			positions.lonepairs.bottom = []
			positions.lonepairs.r_side = []
			positions.lonepairs.l_side = []
			positions.lonepairs.centralAtom = []
		}

	}

})()
