// Create an immediately invoked functional expression to wrap our code
(function() {

	var defaults = {
		unique: true
	};

	// Define our constructor
	this.TextboxList = function(elem, options) {
		this._elem = elem;

		// empty the target
		while (this._elem.firstChild) {
			this._elem.removeChild(this._elem.firstChild);
		}
		
		// add the place for buttons
		this._tags = document.createElement('span');
		this._tags.className += ' tags';
		this._elem.appendChild(this._tags);

		// add the leftover input that will fill the remaining space,
		// allowing for user to click to type anywhere there's room
		this._leftover = document.createElement('input');
		this._leftover.className += ' leftover';
		this._leftover.type = 'text';
		this._leftover._tbl = this;
		this._elem.appendChild(this._leftover);
		this._leftover.onblur = function(){
			if (!this.value.trim()){
				return;
			}

			this._tbl.appendTag(this.value.trim());
			this.value = '';
		}
		this._leftover.onkeydown = function(event){
			if (!this.value.trim()){
				return;
			}

			var BACKSPACEKEY = 8,
				TABKEY = 9,
				ENTERKEY = 13,
				ESCAPEKEY = 27;

			switch (event.keyCode){
				case TABKEY:
				case ENTERKEY:
					this._tbl.appendTag(this.value.trim());
					this.value = '';
					event.preventDefault();
					break;
			}
		}

		// use options
		this._options = defaults;
		for (var property in options) {
			if (options.hasOwnProperty(property)) {
				this._options[property] = options[property];
			}
		}

		//
		this._values = [];
	};

	// getter/setter for values
	TextboxList.prototype.values = function(values) {
		if (!values){ // get
			return this._values;

		// set (check for options.unique)
		} else if (this._options.unique){

			// set unique elements only
			this._values = values.filter(function(item, i, ar){
				return ar.indexOf(item) === i;
			});
			return this;

		} else {

			// set all elements
			this._values = values;
			return this;
		}
	};

	TextboxList.prototype.commit = function(){

		// go through all the tags: get the span containing them
		var tags = this._tags;
		var newValues = [];

		// collect the values of all the tags and inputs:
		for (var i = 0; i <= tags.childNodes.length; i++) {
			var tag = tags.childNodes[i];
			if (!tag){
				continue;
			}

			var newValue;

			if (tag.value){
				newValue = tag.value;
			} else if (tag.textContent){
				newValue = tag.textContent;
			} else {
				newValue = '';
			}

			newValue = newValue.trim();
			if (newValue){
				newValues.push(newValue);
			}
		}

		this.values(newValues);
		newValues = this.values();
		// empty the element:
		while (this._tags.firstChild) {
			this._tags.removeChild(this._tags.firstChild);
		}

		// if there's no values, we're nearly done.
		if (newValues.length === 0){
			return;
		}

		// otherwise create a tag for each element:
		for (var j = 0; j < newValues.length; j++) {
			this.appendTag(newValues[j]);
		}

		return this;
	};

	TextboxList.prototype.appendTag = function(text){
		var tag = createTag(text);
		this._tags.appendChild(tag);
		return tag;
	};

	function createTag(text){
		var tag = document.createElement('button');
		tag.className += ' tag';
		tag.textContent = text;

		tag.onfocus = function(){
			editTag(tag);
		};

		return tag;
	}

	function createInput(text){
		var input = document.createElement('input');
		input.type = 'text';
		input.className += ' editing';
		input.value = text;

		input.onblur = function(){
			commitInput(input);
		};

		input.style.width = getInputWidth(input) + 'px';
		input.oninput = function(){
			input.style.width = getInputWidth(input) + 'px';
		}

		input.onkeyup = function(event){
			var BACKSPACE = 8;
			if (event.keyCode === BACKSPACE){
				if (this.value == ''){
					if (this.previousSibling){
						this.previousSibling.focus();
					}
				}
			}
		}

		return input;
	}

	function editTag(tagElem){
		var input = createInput(tagElem.textContent);

		tagElem.replaceWith(input);
		input.focus();
		
	}

	function commitInput(inputElem){
		if (inputElem.value.trim()){
			var tag = createTag(inputElem.value);
			inputElem.replaceWith(tag);
		} else {
			inputElem.parentNode.removeChild(inputElem);
		}
	}

	function getInputWidth(inputElem){
		var tmp = document.createElement("span"),
			theWidth;
		tmp.className = "input-element tmp-element";
		tmp.textContent = inputElem.value;
		tmp.style.paddingLeft = '6px';
		tmp.style.paddingRight = '6px';
		document.body.appendChild(tmp);

		theWidth = tmp.getBoundingClientRect().width;
		document.body.removeChild(tmp);
		return theWidth;
	}

	var myTBL = new TextboxList(document.getElementById('textboxlist'));
	myTBL.appendTag('tag 1');
	myTBL.appendTag('tag 2');
	myTBL.appendTag('tag 3');
	myTBL.appendTag('tag 4');
	myTBL.appendTag('tag 5');
	myTBL.commit();
}());