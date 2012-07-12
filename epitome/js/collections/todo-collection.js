;(function(window) {
	'use strict';

	window.App = window.App || {};

	// a collection that holds the todos
	App.TodoCollection = new Class({

		Extends: Epitome.Collection,

		Implements: Epitome.Storage.sessionStorage('collection'),

		model: App.Todo,

		todoFilter: function(model) {
			return model.get('completed') == this.filterType;
		}

	});


}(window));
