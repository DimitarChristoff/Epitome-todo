;(function(window) {
	'use strict';

	window.App = window.App || {};

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
					done = !!el.get('checked') ? 'completed' : 'active',
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
			this.collection.filter(this.collection.todoFilter.bind(this.collection)).each(function(model) {

				var obj = model.toJSON(),
					li = new Element(self.tagName).toggleClass('completed', obj.completed == 'completed').store('model', model);

				obj.completedCheckbox = obj.completed == 'completed' ? 'checked="checked"' : '';
				views.push(li.set('html', self.template(obj)));
			});

			this.element.adopt(views);
			this.parent();
			return this;

		}

	});

}(window));