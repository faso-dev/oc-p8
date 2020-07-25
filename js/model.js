(function (window) {
    'use strict';


    /**
     * Crée une nouvelle instance de model et raccorde store.
     * @constructor
     * @param {Object} (storage) Une référence à la classe de stockage côté client {@link Store}.
     */
    function Model(storage) {
        this.storage = storage;
    }


    /**
     * Crée un nouveau model de todo.
     * @param {String} (title) Le contenu du todo.
     * @param {Function} (callback) La fonction de rappel après la création du modèle.
     */
    Model.prototype.create = function (title, callback) {
        title = title || '';
        callback = callback || function () {
        };

        var newItem = {
            title: title.trim(), // enlève les vides
            completed: false
        };

        this.storage.save(newItem, callback);
    };


    /**
     * Trouve et renvoie un modèle en mémoire. Si aucune requête n'est donnée, il va simplement
     * tout retourner. Si vous passez une chaîne ou un numéro, cela ressemblera à l'identifiant
     * du modèle à trouver. Enfin, vous pouvez lui passer un objet.
     * @param {String|Number|Object} (query) Une requête pour faire correspondre les modèles
     * @param {Function} (callback) La fonction de rappel après la découverte du modèle
     *
     * @example
     * model.read(1, func); // Trouvera le model avec un ID de 1
     * model.read('1'); // Comme ci-dessus
     * //Vous trouverez ci-dessous un modèle avec foo égale à bar et un hello égale à world.
     * model.read({ foo: 'bar', hello: 'world' });
     */
    Model.prototype.read = function (query, callback) {
        var queryType = typeof query;
        callback = callback || function () {
        };

        if (queryType === 'function') {
            callback = query;
            return this.storage.findAll(callback);
        } else if (queryType === 'string' || queryType === 'number') {
            query = parseInt(query, 10);
            this.storage.find({id: query}, callback);
        } else {
            this.storage.find(query, callback);
        }
    };


    /**
     * Met à jour un modèle en lui attribuant un ID, des données et un callback lorsque la mise à jour
     * est terminée.
     * @param {number} (id) L' ID du model à mettre à jour.
     * @param {object} (data) Les données à mettre à jour et leurs nouvelles valeurs.
     * @param {function} (callback) La fonction de rappel quand la mise à jour est terminée.
     */
    Model.prototype.update = function (id, data, callback) {
        this.storage.save(data, callback, id);
    };


    /**
     * Supprime un modèle du stockage.
     * @param {number} (id) L' ID du model à supprimer.
     * @param {function} (callback) La fonction de rappel lorsque la suppression est terminée.
     */
    Model.prototype.remove = function (id, callback) {
        this.storage.remove(id, callback);
    };


    /**
     * AVERTISSEMENT: supprimera TOUTES les données du stockage.
     * @param {function} (callback) La fonction de rappel quand le stockage est vider.
     */
    Model.prototype.removeAll = function (callback) {
        this.storage.drop(callback);
    };


    /**
     * Renvoie tous les todos
     */
    Model.prototype.getCount = function (callback) {
        var todos = {
            active: 0,
            completed: 0,
            total: 0
        };

        this.storage.findAll(function (data) {
            data.forEach(function (todo) {
                if (todo.completed) {
                    todos.completed++;
                } else {
                    todos.active++;
                }

                todos.total++;
            });
            callback(todos);
        });
    };


    // Exporte vers Window
    window.app = window.app || {};
    window.app.Model = Model;
})(window);