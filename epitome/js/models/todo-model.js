/*global Epitome, App */
/*jshint mootools:true */
define(['epitome/epitome-model'], function(Model){
	'use strict';

	return new Class({

		Extends: Model,

		options: {
			defaults: {
				completed: false,
				title: ''
			}
		}
	});

});