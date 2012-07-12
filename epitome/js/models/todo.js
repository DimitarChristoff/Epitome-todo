;(function(window) {
	'use strict';

	var App = {};

	App.Todo = new Class({

		Extends: Epitome.Model,

		options: {
			defaults: {
				completed: 'completed',
				title: ''
			}
		}
	});


	App.TodoCollection = new Class({

		Extends: Epitome.Collection,

		Implements: Epitome.Storage.sessionStorage('collection'),

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
				var obj = model.toJSON();

				obj.completedCheckbox = obj.completed ? 'checked="checked"' : '';
				views.push(self.template(obj));
			});

			this.element.set('html', views.join(''));
			this.parent();
			return this;

		}

	});

	window.App = App;

}(window));