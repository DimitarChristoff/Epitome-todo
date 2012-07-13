Epitome Todos
=============

This is a submodule repository with a todo demo of (Epitome)[https://github.com/DimitarChristoff/Epitome] for MooTools

You should check it out from the main repository as a submodule:

   git submodule init
   git submodule update

Then just visit `[epitomeroot]/example/todo/epitome/` in your browser.


Structure
=========

The todo app is implemented to be sort of close to the Backbone.js implementation but with one substantial difference.
There are two views, one for the main app rendering and events (`todo-main.js`) and one for the todos themselves via
`todo-list/js`. Both of these views are bound to the collection in `todo-collection.js` and render their respective
parts of the app by listening to the same events on the collection.

Backbone instead have a single application view that uses a subview to create individual todo items as elements only
and then renders it all at the same time.

