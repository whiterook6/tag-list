// Create an immediately invoked functional expression to wrap our code
(function() {

	var defaults = {
		unique: true
	};

	// Define our constructor
	this.TextboxList = function(elem, options) {
		this.elem = elem;
		this.options = defaults;
		for (var property in options) {
			if (options.hasOwnProperty(property)) {
				this.options[property] = options[property];
			}
		}
	
		this._values = [];
	};

	// getter/setter for values
	TextboxList.prototype.values = function(values) {
		if (!values){ // get
			return this._values;

		// set (check for options.unique)
		} else if (this.options.unique){

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
		var children = this.elem.childNodes;
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
		while (this.elem.firstChild) {
			this.elem.removeChild(this.elem.firstChild);
		}

		// if there's no values, we're nearly done.
		if (newValues.length === 0){
			return;
		}

		// otherwise create a tag for each element:
		for (var j = 0; j < newValues.length; j++) {
			this.appendTag(newValues[j]);
		}
	};

	TextboxList.prototype.appendTag = function(text){
		var tag = document.createElement('span');

		tag.className += "tag";
		tag.textContent = text;
		tag.onclick = function(){
			debugger;
		};

		this.elem.appendChild(tag);
	};

	var myTBL = new TextboxList(document.getElementById('textboxlist'));
	myTBL.commit();
}());