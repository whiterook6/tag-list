// Create an immediately invoked functional expression to wrap our code
(function() {

	var defaults = {
		unique: true
	};

	// Define our constructor
	this.TextboxList = function(elem, options) {
		this._elem = elem;

		this._options = defaults;
		for (var property in options) {
			if (options.hasOwnProperty(property)) {
				this._options[property] = options[property];
			}
		}
	
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
		var children = this._elem.childNodes;
		var newValues = [];

		// collect the values of all the tags and inputs:
		for (var i = 0; i <= children.length; i++) {
			var child = children[i];
			if (!child){
				continue;
			}

			var newValue;

			if (child.value){
				newValue = child.value;
			} else if (child.textContent){
				newValue = child.textContent;
			}

			newValue = newValue.trim();
			if (newValue){
				newValues.push(newValue);
			}
		}

		this.values(newValues);
		newValues = this.values();
		// empty the element:
		while (this._elem.firstChild) {
			this._elem.removeChild(this._elem.firstChild);
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
		this._elem.appendChild(tag);
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

		return input;
	}

	function editTag(tagElem){
		var input = createInput(tagElem.textContent);

		tagElem.replaceWith(input);
		input.focus();

		return input;
	}

	function commitInput(inputElem){
		var tag = createTag(inputElem.value);
		inputElem.replaceWith(tag);

		return tag;
	}

	var myTBL = new TextboxList(document.getElementById('textboxlist'));
	myTBL.appendTag('tag 1');
	myTBL.appendTag('tag 2');
	myTBL.appendTag('tag 3');
	myTBL.appendTag('tag 4');
	myTBL.appendTag('tag 5');
	myTBL.commit();
}());