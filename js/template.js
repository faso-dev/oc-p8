/*jshint laxbreak:true */
(function (window) {
	'use strict';


	var htmlEscapes = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		'\'': '&#x27;',
		'`': '&#x60;'
	};


	var escapeHtmlChar = function (chr) {
		return htmlEscapes[chr];
	};

	var reUnescapedHtml = /[&<>"'`]/g;
	var reHasUnescapedHtml = new RegExp(reUnescapedHtml.source);

	var escape = function (string) {
		return (string && reHasUnescapedHtml.test(string))
			? string.replace(reUnescapedHtml, escapeHtmlChar)
			: string;
	};


	/**
	 * Définit les valeurs par défaut du template
	 * @constructor
	 */
	function Template() {
		this.defaultTemplate
			=	'<li data-id="{{id}}" class="{{completed}}">'
			+		'<div class="view">'
			+			'<input class="toggle" type="checkbox" {{checked}}>'
			+			'<label>{{title}}</label>'
			+			'<button class="destroy"></button>'
			+		'</div>'
			+	'</li>';
	}

	/**
	 * Créé une chaîne HTML <li> et la retourne pour la placer dans l'application.
	 * @param {object} (data) L'objet contenant les clés que vous souhaitez trouver
	 *                        dans le modèle à remplacer.
	 * @returns {string} Template HTML correspondant à l' élément <li>
	 *
	 * @example
	 * view.show({
	 *	id: 1,
	 *	title: "Hello World",
	 *	completed: 0,
	 * });
	 */
	Template.prototype.show = function (data) {
		var i, l;
		var view = '';

		for (i = 0, l = data.length; i < l; i++) {
			var template = this.defaultTemplate;
			var completed = '';
			var checked = '';

			if (data[i].completed) {
				completed = 'completed';
				checked = 'checked';
			}

			template = template.replace('{{id}}', data[i].id);
			template = template.replace('{{title}}', escape(data[i].title));
			template = template.replace('{{completed}}', completed);
			template = template.replace('{{checked}}', checked);

			view = view + template;
		}

		return view;
	};


	/**
	 * Affiche un compteur du nombre de tâches à terminer.
	 * @param {number} (activeTodos) Le nombre de todos actifs.
	 * @returns {string} Chaîne contenant le nombre.
	 */
	Template.prototype.itemCounter = function (activeTodos) {
		let plural = activeTodos > 1 ? 's' : '',
			verb = activeTodos > 1 ? 'nt' : ''
		;
		return '<strong>' + activeTodos + '</strong> tâche' + plural + ' reste' + verb;
	};


	/**
	 * Met à jour le texte dans le bouton "Clear completed".
	 * @param  {number} (completedTodos) Le nombre de todos complété.
	 * @returns {string} Chaîne contenant le nombre.
	 */
	Template.prototype.clearCompletedButton = function (completedTodos) {
		if (completedTodos > 0) {
			return 'Clear completed';
		} else {
			return '';
		}
	};


	// Exporte vers Window
	window.app = window.app || {};
	window.app.Template = Template;
})(window);