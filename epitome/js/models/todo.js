;(function(window) {
	'use strict';

	var App = {};

	App.Todo = new Class({

		Extends: Epitome.Model,

		options: {
			defaults: {
				completed: '',
				title: ''
			}
		}
	});


	App.TodoCollection = new Class({

		Extends: Epitome.Collection,

		Implements: Epitome.Storage.sessionStorage('collection'),

		model: App.Todo

	});


	App.MicroView = new Class({

		Extends: Epitome.View,

		tagName: 'li',

		options: {
			template: document.id('item-template').get('text'),
			// what events to
			events: {
				'click:relay(input.toggle)': 'statusChange',
				'dblclick:relay(.view)': 'editing',
				'click:relay(button.destroy)': 'removeItem',
				'keypress:relay(input.edit)': 'updateOnEnter',
				'blur:relay(input.edit)': 'close'
			},
			onStatusChange: function(e, el) {
				console.log('hai');

			},

			onEditing: function() {
				this.element.toggleClass('editing');
				this.input.focus();
			},

			onClose: function() {
				this.element.toggleClass('editing');
				var value = this.input.get('value').trim();

				if (!value.length) {
					this.fireEvent('removeItem');
				}

				this.model.set('title', value);
			},

			"onDestroy:model": function() {
				this.element.destroy();
			},

			"onChange:model": function() {
				this.render();
			},

			onRemoveItem: function() {
				this.model.destroy();
			},

			onUpdateOnEnter: function(e) {
				if (e.key === 'enter')
					this.input.blur();
			}
		},

		render: function() {
			// element is new.
			if (!this.element)
				this.setElement(new Element(this.tagName), this.options.events);

			var obj = this.model.toJSON();

			obj.completedCheckbox = obj.completed ? 'checked="checked"' : '';
			this.element.set('html', this.template(obj)).toggleClass('completed', obj.completed);
			this.input = this.element.getElement('input.edit');
			this.parent();
			return this;
		}
	});


	window.mv = new App.MicroView({

		model: new App.Todo({
			title: 'hai',
			completed: ''
		})

	});

	document.id('todo-list').adopt(mv.render().element);

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