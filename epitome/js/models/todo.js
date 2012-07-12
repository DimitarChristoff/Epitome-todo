;(function(window) {
	'use strict';

	var App = {};

	// base structure for the todos themselves
	App.Todo = new Class({

		Extends: Epitome.Model,

		options: {
			defaults: {
				completed: 'completed',
				title: ''
			}
		}
	});

	// a collection that holds the todos
	App.TodoCollection = new Class({

		Extends: Epitome.Collection,

		Implements: Epitome.Storage.sessionStorage('collection'),

		model: App.Todo

	});

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

	App.TodoView = new Class({

		Extends: Epitome.View,

		tagName: 'li',

		options: {

			editingClass: 'editing',

			input: 'input.edit',

			events: {
				'blur:relay(input.edit)': 'update',
				'click:relay(input.toggle)': 'statusChange',
				'keypress:relay(input.edit)': 'handleKeypress',
				'click:relay(button.destroy)': 'removeItem',
				'dblclick:relay(li)': 'editing'
			},

			onReady: function() {
				this.render();
			},

			"onChange:collection": function(model) {
				this.collection.store();
				this.render();
			},

			"onRemove:collection": function(model) {
				this.collection.store();
				this.render();
			},

			"onSort:collection": function() {
				this.collection.store();
				this.render();
			},

			"onAdd:collection": function(model) {
				this.collection.store();
				this.render();
			},

			onEditing: function(e, el) {
				e && e.stop && e.stop();
				el.addClass(this.options.editingClass);
				el.getElement(this.options.input).focus();
			},

			onUpdate: function(e, el) {
				var p = el.getParent('li').removeClass(this.options.editingClass),
					value = el.get('value').trim();

				if (!value.length) {
					this.collection.removeModel(p.retrieve('model'));
					return;
				}
				p.retrieve('model').set('title', value);
			},

			onStatusChange: function(e, el) {
				var p = el.getParent('li'),
					done = !!el.get('checked') ? 'completed' : '',
					toggler = document.id('toggle-all');

				p.retrieve('model').set('completed', done);
			},

			onRemoveItem: function(e, el) {
				this.collection.removeModel(el.getParent('li').retrieve('model'));
			}
		},

		render: function() {
			var views = new Elements(),
				self = this;


			this.empty();
			this.collection.each(function(model) {
				var obj = model.toJSON(),
					li = new Element(self.tagName).toggleClass('completed', !!obj.completed).store('model', model);

				obj.completedCheckbox = obj.completed ? 'checked="checked"' : '';
				views.push(li.set('html', self.template(obj)));
			});

			this.element.adopt(views);
			this.parent();
			return this;

		}

	});

	window.App = App;

}(window));