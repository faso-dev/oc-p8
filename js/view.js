/*global qs, qsa, $on, $parent, $delegate */
(function (window) {
    'use strict';


    /**
     * Définit les valeurs par défaut du {@link Template}.
     * @constructor
     */
    function View(template) {
        this.template = template;

        this.ENTER_KEY = 13;
        this.ESCAPE_KEY = 27;

        this.$todoList = qs('.todo-list');
        this.$todoItemCounter = qs('.todo-count');
        this.$clearCompleted = qs('.clear-completed');
        this.$main = qs('.main');
        this.$footer = qs('.footer');
        this.$toggleAll = qs('.toggle-all');
        this.$newTodo = qs('.new-todo');
    }


    /**
     * Supprime la Todo en fonction de l’ id.
     * @param {number} (id) L' ID de l' élément à supprimer.
     */
    View.prototype._removeItem = function (id) {
        var elem = qs('[data-id="' + id + '"]');

        if (elem) {
            this.$todoList.removeChild(elem);
        }
    };


    /**
     * Masque les éléments terminés.
     * @param  {number} (completedCount) Le nombre d' élément coché.
     * @param  {Boolean} (visible) True si visible, false sinon.
     */
    View.prototype._clearCompletedButton = function (completedCount, visible) {
        this.$clearCompleted.innerHTML = this.template.clearCompletedButton(completedCount);
        this.$clearCompleted.style.display = visible ? 'block' : 'none';
    };


    /**
     * Indique la page actuelle.
     * @param {string} (currentPage) La page actuelle peut avoir les valeures
     *                               '' || active || completed.
     */
    View.prototype._setFilter = function (currentPage) {
        qs('.filters .selected').className = '';
        qs('.filters [href="#/' + currentPage + '"]').className = 'selected';
    };


    /**
     * Test si l' élément' est terminé.
     * @param  {Number} (id) L'ID de l'élément à tester.
     * @param  {Boolean} (completed) Le statut de l' élément.
     */
    View.prototype._elementComplete = function (id, completed) {
        var listItem = qs('[data-id="' + id + '"]');

        if (!listItem) {
            return;
        }

        listItem.className = completed ? 'completed' : '';

        // Valider un élément en cochant la case
        qs('input', listItem).checked = completed;
    };


    /**
     * Permet l' édition d'un élément.
     * @param  {number} (id) L' ID de l' élément à éditer.
     * @param  {string} (title) Le contenu de la modification de l' élément.
     */
    View.prototype._editItem = function (id, title) {
        var listItem = qs('[data-id="' + id + '"]');

        if (!listItem) {
            return;
        }

        listItem.className = listItem.className + ' editing';

        var input = document.createElement('input');
        input.className = 'edit';

        listItem.appendChild(input);
        input.focus();
        input.value = title;
    };


    /**
     * Remplace l' ancien élément par l' élément édité.
     * @param  {number} (id)    L' ID de l' élément à éditer.
     * @param  {string} (title) Le contenu de le la modification de l' élément.
     */
    View.prototype._editItemDone = function (id, title) {
        var listItem = qs('[data-id="' + id + '"]');

        if (!listItem) {
            return;
        }

        var input = qs('input.edit', listItem);
        listItem.removeChild(input);

        listItem.className = listItem.className.replace('editing', '');

        qsa('label', listItem).forEach(function (label) {
            label.textContent = title;
        });
    };


    /**
     * Retourne les éléments dans le DOM.
     * @param  {string} (viewCmd)   La fonction active.
     * @param  {object} (parameter) Les paramètres actifs.
     */
    View.prototype.render = function (viewCmd, parameter) {
        var self = this;
        var viewCommands = {
            /**
             * Affiche les éléments
             */
            showEntries: function () {
                self.$todoList.innerHTML = self.template.show(parameter);
            },
            /**
             * Supprime l' élément
             */
            removeItem: function () {
                self._removeItem(parameter);
            },
            /**
             * Met à jour le compteur
             */
            updateElementCount: function () {
                self.$todoItemCounter.innerHTML = self.template.itemCounter(parameter);
            },
            /**
             * Affiche le bouton 'clearCompleted'
             */
            clearCompletedButton: function () {
                self._clearCompletedButton(parameter.completed, parameter.visible);
            },
            /**
             * Vérifie la visibilité d' élément
             */
            contentBlockVisibility: function () {
                self.$main.style.display = self.$footer.style.display = parameter.visible ? 'block' : 'none';
            },
            /**
             * Affiche tous les éléments
             */
            toggleAll: function () {
                self.$toggleAll.checked = parameter.checked;
            },
            /**
             * Filtre les éléments
             */
            setFilter: function () {
                self._setFilter(parameter);
            },
            /**
             * Vide le contenu du nouveau todo dans l' input
             */
            clearNewTodo: function () {
                self.$newTodo.value = '';
            },
            /**
             * Affiche les éléments avec le statut completed
             */
            elementComplete: function () {
                self._elementComplete(parameter.id, parameter.completed);
            },
            /**
             * Permet d' éditer un élément
             */
            editItem: function () {
                self._editItem(parameter.id, parameter.title);
            },
            /**
             * Sauvegarde l' édition d' un élément
             */
            editItemDone: function () {
                self._editItemDone(parameter.id, parameter.title);
            }
        };

        viewCommands[viewCmd]();
    };


    /**
     * Ajoute un ID à l' élément.
     * @param  {object} (element) L' élément actif.
     */
    View.prototype._itemId = function (element) {
        var li = $parent(element, 'li');
        return parseInt(li.dataset.id, 10);
    };


    /**
     * EventListener sur la validation de l' édition d'un élément.
     * @param  {function} (handler) Un callback exécuté sous condition.
     */
    View.prototype._bindItemEditDone = function (handler) {
        var self = this;
        $delegate(self.$todoList, 'li .edit', 'blur', function () {
            if (!this.dataset.iscanceled) {
                handler({
                    id: self._itemId(this),
                    title: this.value
                });
            }
        });

        $delegate(self.$todoList, 'li .edit', 'keypress', function (event) {
            /**
             * Retire le curseur du bouton lorsque l'on appuie sur Entrée.
             */
            if (event.keyCode === self.ENTER_KEY) {
                this.blur();
            }
        });
    };


    /**
     * EventListener sur l' annulation de l' édition d'un élément.
     * @param  {function} (handler) Un callback exécuté sous condition.
     */
    View.prototype._bindItemEditCancel = function (handler) {
        var self = this;
        $delegate(self.$todoList, 'li .edit', 'keyup', function (event) {
            if (event.keyCode === self.ESCAPE_KEY) {
                this.dataset.iscanceled = true;
                this.blur();

                handler({id: self._itemId(this)});
            }
        });
    };


    /**
     * Fait le lien entre les méthodes du {@link Controller} et les éléments de {@link View}.
     * @param  {function} (event)   L' évenement actif.
     * @param  {function} (handler) Un callback exécuté sous condition.
     */
    View.prototype.bind = function (event, handler) {
        var self = this;
        if (event === 'newTodo') {
            /**
             * $on : ajoute eventListener.
             * passe self.$newTodo.value au handler (contenu de l'input).
             */
            $on(self.$newTodo, 'change', function () { //
                handler(self.$newTodo.value); //
            });

        } else if (event === 'removeCompleted') {
            $on(self.$clearCompleted, 'click', function () {
                handler();
            });

        } else if (event === 'toggleAll') {
            $on(self.$toggleAll, 'click', function () {
                handler({completed: this.checked});
            });

        } else if (event === 'itemEdit') {
            $delegate(self.$todoList, 'li label', 'dblclick', function () {
                handler({id: self._itemId(this)});
            });

        } else if (event === 'itemRemove') {
            $delegate(self.$todoList, '.destroy', 'click', function () {
                handler({id: self._itemId(this)});
            });

        } else if (event === 'itemToggle') {
            $delegate(self.$todoList, '.toggle', 'click', function () {
                handler({
                    id: self._itemId(this),
                    completed: this.checked
                });
            });

        } else if (event === 'itemEditDone') {
            self._bindItemEditDone(handler);

        } else if (event === 'itemEditCancel') {
            self._bindItemEditCancel(handler);
        }
    };


    // Exporte vers Window
    window.app = window.app || {};
    window.app.View = View;
}(window));