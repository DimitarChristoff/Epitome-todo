/*jshint mootools:true */
;(function(exports) {
	'use strict';

	// wrapper function for requirejs or normal object
	var wrap = function(Collection) {

		var	noUrl = 'no-urlRoot-set',
			eventPseudo = 'fetch:';

		return new Class({
			// allows for fetching collections of model from the server

			Extends: Collection,

			options: {
				urlRoot: noUrl
			},

			initialize: function(models, options) {
				this.setupSync();
				this.parent(models, options);
			},

			setupSync: function() {
				// single request object as in models. independent of models.
				var self = this,
					rid = 0,
					incrementRequestId = function() {
						// request ids are unique and private. private to up them.
						rid++;
					};

				// public methods - next likely is current rid + 1
				this.getRequestId = function() {
					return rid + 1;
				};

				this.request = new Request.JSON({
					// one request at a time
					link: 'chain',
					url: this.options.urlRoot,
					emulation: this.options.emulateREST,
					onRequest: incrementRequestId,
					onCancel: function() {
						this.removeEvents(eventPseudo + rid);
					},
					onSuccess: function(responseObj) {
						responseObj = self.postProcessor && self.postProcessor(responseObj);
						self.fireEvent(eventPseudo + rid, [[responseObj]]);
					},
					onFailure: function() {
						self.fireEvent(eventPseudo + 'error', [this.options.method, this.options.url, this.options.data]);
					}
				});

				return this;
			},

			parse: function(resp) {
				// pre-processor for json object from response.
				return resp;
			},

			fetch: function(refresh) {
				// get a list of models. `@refresh (boolean)` will empty collection first

				// set the onSuccess event for this fetch call
				this._throwAwayEvent(function(models) {
					if (refresh) {
						this.empty();
						Array.each(models, this.addModel.bind(this));
					}
					else {
						this.processModels(models);
					}

					// finaly fire the event to instance
					this.fireEvent('fetch', [models])
				});

				this.request.get();

				// dangerous. async stuff coming.
				return this;
			},

			processModels: function(models) {
				// deals with newly arrived objects which can either update existing models or be added as new models
				// `@models (array or objects)`, not actual model instances
				var self = this;

				Array.each(models, function(model) {
					var exists = model.id && self.getModelById(model.id);

					if (exists) {
						exists.set(model);
					}
					else {
						self.addModel(model);
					}
				});
			},

			_throwAwayEvent: function(callback) {
				// this is a one-off event that will ensure a fetch event fires only once per `.fetch`
				var eventName = eventPseudo + this.getRequestId(),
					self = this,
					throwAway = {};

				if (!callback || typeof callback !== 'function')
					return;

				throwAway[eventName] = function(responseObj) {
					callback.apply(self, responseObj);

					// remove this one-off event.
					self.removeEvents(throwAway);
				};

				return this.addEvents(throwAway);
			}.protect(),

			postProcessor: function(jsonResponse){
				// apply a post-processor to response
				return jsonResponse;
			}

		});
	}; // end wrap

	if (typeof define === 'function' && define.amd) {
		// requires epitome model and all its deps
		define(['./epitome-collection'], wrap);
	}
	else {
		exports.Epitome.Collection.Sync = wrap(exports.Epitome.Collection);
	}
}(this));