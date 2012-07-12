(function(window) {
	'use strict';

	return;
	// Your starting point. Enjoy the ride!
	var collection = new App.TodoCollection(null, {
		id: 'todos'
	});

	// populate from storage if available
	collection.setUp(collection.retrieve());

	App.todosView = new App.TodoView({

		collection: collection,

		model: App.Todo,

		element: document.id('todo-list'),

		template: document.id('item-template').get('text'),

		events: {
			'focus:relay(input.edit)': 'editing',
			'blur:relay(input.edit)': 'update',
			'click:relay(input.toggle)': 'statusChange',
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
			el.addClass('editing');
			el.getElement('input.edit').focus();
		},

		onUpdate: function(e, el) {
			var p = el.getParent('li').removeClass('editing');
			this.collection.getModelById(p.get('id')).set('title', el.get('value'));
		},

		onStatusChange: function(e, el) {
			var p = el.getParent('li'),
				done = !!el.get('checked') ? 'completed' : '';

			this.collection.getModelById(p.get('id')).set('completed', done);
		},

		onRemoveItem: function(e, el) {
			var p = el.getParent('li');
			this.collection.removeModel(this.collection.getModelById(p.get('id')));
		}

	});


})(window);