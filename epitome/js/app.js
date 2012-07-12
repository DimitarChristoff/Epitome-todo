(function(window) {
	'use strict';

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


})(window);