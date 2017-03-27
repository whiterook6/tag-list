angular.module('myApp', [])
	.controller('TagListController', function() {
		var ctrl = this;

		ctrl.editing = 3;

		ctrl.tags = [{
			text: 'tag 1',
		}, {
			text: 'tag 2',
		}, {
			text: 'tag 3',
		}, {
			text: 'tag 4',
		}, {
			text: 'tag 5',
		}, {
			text: 'tag 6',
		}, {
			text: 'tag 7',
		}, {

		}];

		ctrl.edit = function(which){
			ctrl.reduce_tags();
			ctrl.editing = which;
		};

		ctrl.append_tag = function(){
			ctrl.tags.push('');
			ctrl.editing = ctrl.tags.length - 1;
		};

		ctrl.commit = function(){
			ctrl.editing = -1;
		};

		ctrl.reduce_tags = function(){
			ctrl.tags = ctrl.tags.filter(function(item, i, ar){
				return ar.indexOf(item) === i;
			});
		};
	});
