;(function(window) {
	'use strict';

	window.App = window.App || {};

	// a collection that holds the todos
	App.TodoCollection = new Class({

		Extends: Epitome.Collection,

		Implements: Epitome.Storage.localStorage('collection'),

		model: App.Todo,

		todoFilter: function(model) {
			return this.filterType === false ? true : model.get('completed') == this.filterType;
		}

	});


}(window));
