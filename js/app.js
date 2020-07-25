/**
 * See {@link MyClass} and [MyClass's foo property]{@link MyClass#todo}.
 * Also, check out {@link http://www.google.com|Google} and
 * {@link https://github.com GitHub}.
 */
(function () {
    'use strict';


    /**
     * Configure une toute nouvelle Todo list.
     * @constructor
     * @param {string} (name) Le nom de votre nouvelle TODO list.
     */
    function Todo(name) {
        this.storage = new app.Store(name);
        this.model = new app.Model(this.storage);
        this.template = new app.Template();
        this.view = new app.View(this.template);
        this.controller = new app.Controller(this.model, this.view);
    }

    /**
     * Définit un nouveau todo
     */
    var todo = new Todo('todos-vanillajs'); // dans View.js, View.prototype.bind() et View.prototype.render()


    /**
     * Ajoute la route de la page dans l' url ''|| active || completed
     */
    function setView() {
        todo.controller.setView(document.location.hash);
    }


    $on(window, 'load', setView);
    $on(window, 'hashchange', setView);
})();