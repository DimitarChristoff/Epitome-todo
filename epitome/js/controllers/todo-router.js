/*global Epitome, App */
/*jshint mootools:true */
define(['epitome/epitome-router'], function(Router){
	'use strict';

	return new Class({

		Extends: Router,

		options: {
			routes: {
				'': 'init',
					'#!/': 'applyFilter',
					'#!/:filter': 'applyFilter'
			},

			onInit: function() {
				// we want to always have a state
				this.navigate('#!/');
			}
		},
		showActiveFilter: function() {
			// fix up the links for current filter
			var self = this;
			document.getElements( '#filters li a' ).each(function( link ) {
				link.set( 'class', link.get( 'href' ) === self.req ? 'selected' : '' );
			});
		}
	});

});