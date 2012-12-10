/*global Epitome, App */
/*jshint mootools:true */
define([
	'epitome/epitome-collection',
	'epitome/epitome-storage',
	'models/todo-model'
], function(Collection, Storage, Model){
	'use strict';

	// a collection that holds the todos
	return new Class({
		// normal collection or Collection.Sync
		Extends: Collection,

		// enable storage methods, namespaced as collection.
		Implements: Storage.localStorage('collection'),

		// base model class prototype
		model: Model,

		map: {
			active: 0,
			completed: 1
		},

		todoFilter: function( model ) {
			// references the filterType which the controller sets
			return this.filterType === false ? true : this.map[this.filterType] === +model.get( 'completed' );
		}
	});
});