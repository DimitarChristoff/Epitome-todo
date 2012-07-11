;(function(window) {
	'use strict';

	var App = {};

	App.Todo = new Class({

		Extends: Epitome.Model,

		Implements: Epitome.Storage,

		options: {
			defaults: {
				status: 'Incomplete',
				todo: ''
			}
		}
	});


	App.TodoCollection = new Class({

		Extends: Epitome.Collection,

		model: App.Todo

	});


	App.TodoView = new Class({

		Extends: Epitome.View,

		collection: App.TodoCollection,

		render: function() {
			var views = [],
				self = this;


			this.empty();
			this.collection.each(function(model) {
				views.push(self.template(model.toJSON()));
			});

			this.element.set('html', views.join(''));
			this.parent();
			return this;

		}

	});

	window.App = App;

}(window));