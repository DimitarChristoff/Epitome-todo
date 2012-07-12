(function(window) {
	'use strict';

	var App = window.App;

	// Your starting point. Enjoy the ride!
	var collection = new App.TodoCollection(null, {
		id: 'todos'
	});

	// populate from storage if available
	collection.setUp(collection.retrieve());

	App.todoView = new App.TodoView({

		collection: collection,

		model: App.Todo,

		element: document.id('todo-list'),

		template: document.id('item-template').get('text')


	});

	App.mainView = new App.MainView({

		collection: collection,

		element: document.id('todoapp')
	});


	App.router = new Epitome.Router({
		routes: {
			'': 'init',
			'#!/': 'applyFilter',
			'#!/:filter': 'applyFilter'
		},

		onInit: function() {
			this.navigate('#!/');
		},

		onApplyFilter: function(filter) {
			collection.filterType = filter || false;
			App.todoView.render();

			var self = this;
			document.getElements('#filters li a').each(function(link) {
				link.set('class', link.get('href') == self.req ? 'selected' : '');
			});
		}

	});


})(window);