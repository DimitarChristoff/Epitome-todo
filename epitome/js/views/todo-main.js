;(function(window) {
	'use strict';

	window.App = window.App || {};

	// main view encapsulating the app itself.
	App.MainView = new Class({

		Extends: Epitome.View,

		options: {
			events: {
				'change:relay(#new-todo)': 'addTodo',
				'keypress:relay(#new-todo)': 'handleKeypress',
				'click:relay(#toggle-all)': 'toggleAll',
				'click:relay(#clear-completed)': 'clearCompleted'
			},

			newTodo: 'new-todo',

			footer: 'footer',

			toggleAll: 'toggle-all',

			onToggleAll: function(e, el) {
				this.collection.each(function(model) {
					model.set('completed', el.get('checked') ? 'completed' : '');
				});
			},

			onHandleKeypress: function(e, el) {
				if (e.key == 'enter')
					this.addTodo();

				if (e.key == 'esc')
					this.newTodo.set('value', '').blur();
			},

			onClearCompleted: function() {
				// becasue removing a model reindexes, cannot apply that in a normal loop.
				var toRemove = this.collection.filter(function(model) {
					return model.get('completed');
				});

				// grab individual models and remove them.
				Array.each(toRemove, this.collection.removeModel.bind(this.collection))
			},

			onAddTodo: function() {
				this.addTodo();
			},

			'onChange:collection': function() {
				this.render();
			},

			template: document.id('stats-template').get('text')
		},

		initialize: function(options) {
			this.parent(options);
			this.newTodo = document.id(this.options.newTodo);
			this.footer = document.id(this.options.footer);
			this.toggleAll = document.id(this.options.toggleAll);
			this.render();
		},

		addTodo: function() {
			var val = this.newTodo.get('value').trim();

			if (val.length) {
				this.collection.addModel({
					title: val,
					completed: ''
				});
			}

			this.newTodo.set('value', '');
		},

		render: function() {
			var completed = this.collection.filter(function(el) {
				return el.get('completed');
			}).length,
				remaining = this.collection.length - completed;

			this.footer.set('html', this.template({
				completed: completed,
				remaining: remaining
			}));

			this.toggleAll.set('checked', !remaining);
		}

	});

}(window));