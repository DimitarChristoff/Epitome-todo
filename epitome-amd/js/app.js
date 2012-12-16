/*global Epitome */
/*jshint mootools:true */
(function(window){
	'use strict';

	require.config({
		baseUrl: './',
		paths: {
			epitome: './js/lib/epitome/',
			collections: './js/collections/',
			controllers: './js/controllers/',
			models: './js/models/',
			views: './js/views/'
		}
	});

	require([
		'collections/todo-collection',
		'views/todo-list',
		'views/todo-main',
		'controllers/todo-router'
	], function(Collection, ListView, ListOuterView, Router){
		var todos = new Collection(null, {
			// a consistent id is needed if you want to use storage for a collection
			id: 'todos'
		});

		todos.filterType = false;

		todos.setUp(todos.retrieve()); // restore models from storage

		var list = new ListView({

			// bind to the collection and its events and model events
			collection: todos,

			// encapsulating element to bind to
			element: document.id('todo-list'),

			// template to use
			template: document.id('item-template').get('text')

		});

		var view = new ListOuterView({

			// also bound to the same collection but with a different output logic.
			collection: todos,

			// encapsulating element to bind to
			element: document.id('todoapp'),

			// stats template from DOM
			template: document.id('stats-template').get('text'),

			onReady: function(){
				// need to work with controller that sets the current state of filtering
				var proxy = function(){
					router.showActiveFilter();
				};

				this.addEvents({
					'add:collection': proxy,
					'change:collection': proxy
				});
			}
		});


		var router = new Router({
			onApplyFilter: function(filter){
				// the filter is being used by the todo collection and view.
				// when false, the whole collection is being passed.
				todos.filterType = filter || false;

				// render as per current filter
				list.render();

				this.showActiveFilter();
			}
		});
	});

}());
