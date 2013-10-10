/*global requestAnimationFrame:false, clearInterval: false, clearTimeout: false, document: false, event: false, frames: false, history: false, Image: false, location: false, name: false, navigator: false, Option: false, parent: false, screen: false, setInterval: false, setTimeout: false, window: false, XMLHttpRequest: false */
/*global alert: true, confirm: true, console: false, Debug: true, opera: false, prompt: false, WSH: false */
/*jslint plusplus: true */

/**
 * Classe de gestion d'animation légère
 * 
 * @author Jonathan Martel (jmartel@cmaisonneuve.qc.ca)
 * @date 2013-10-09
 * @update 2013-10-10
 * @license Creative Commons BY-NC 3.0 (Licence Creative Commons Attribution - Pas d’utilisation commerciale 3.0 non transposé)
 * @license http://creativecommons.org/licenses/by-nc/3.0/deed.fr
 * 
 */

// TODO : Ajouter la possibilité d'animer plus d'un élément avec les mêmes propriétés
// TODO : Vérifier la pertinence de passer ça en Immediately-Invoked Function Expression (IIFE)
// Voir : The Module Pattern => http://benalman.com/news/2010/11/immediately-invoked-function-expression/

/*
var propAnim = {
			element: ,
			prop: [],
			unite: [],
			fin: [],
			delai: 700,
			callback: function(){}
		};
*/





function Anim(ani)
{
	"use strict";
	var erreur;
	this.deltaTime =null;
	this.maintenant = null;
	this.avant =null;
	this.statut = 
	{
		demarrer:'demarrer',
		arret: 'arret',
		pause:'pause',
		fin:'fin'
	};
	
	if(ani)
	{
		this.ani = ani;
	}
	else
	{
		throw new TypeError("L'animation n'est pas définie");
		
	}
	
	
	if(this.ani)
	{
		this.prepAnim();
	}
	
}


/**
* Fonction qui prépare l'animation. elle calcul le nombre d'iteration nécessaire et le pas (la valeur de changement pour chaque frame) de chaque déplacement.
**/
Anim.prototype.prepAnim = function()
{
	"use strict";
	var i;
	var valeur;
	this.ani.valeur = [];
	this.ani.debut = [];
	this.ani.inter = [];
	this.ani.typeProp = [];
	
	// Calcul du nombre d'iteration
	// this.ani.iteration = this.ani.delai / this.deltaTime;
//TODO : Vérifier l'existence de la propriété et son attachement (CSS ou DOM Element)

	// Pour chaque propriété à animer.
	for(i=0;i<this.ani.prop.length; i++)
	{
		// Vérifier le type de propriété (CSS ou DOM)
		
		if(this.ani.element[this.ani.prop[i]] !== undefined && this.ani.element[this.ani.prop[i]] !== null)	// Prop DOM
		{
			this.ani.typeProp[i] = 'DOM';
			
			// Lecture de la valeur actuelle
			this.ani.valeur[i] = parseFloat(this.ani.element[this.ani.prop[i]]);
			this.ani.debut[i] = this.ani.valeur[i];
			
		}
		else
		{
			this.ani.typeProp[i] = 'CSS';
			
			// Lecture de la valeur actuelle
			valeur = window.getComputedStyle(this.ani.element,null).getPropertyValue(this.ani.prop[i]);		// BUG : Dans Chrome, valeur == auto et non la valeur calculée
			if(valeur == "auto")
			{
				throw new Error('La propriété retourne une valeur non numérique ('+ this.ani.prop[i]+'='+valeur +')');
			}
			this.ani.valeur[i] = parseFloat(valeur);
			this.ani.debut[i] = this.ani.valeur[i];
		}
	
		console.log(this.ani.valeur[i]);
				
		// Calcul du pas
		//this.ani.inter[i] = (this.ani.fin[i] - valeur) / (this.ani.delai / this.deltaTime);
		console.log(this.ani);

	}
	
	
};

/**
* Fonction qui permet d'animer les propriétés définis par l'objet litéral.
*
*/
Anim.prototype.animationStep = function()
{
	"use strict";
	var i;
	var step;
	
	this.maintenant = Date.now();
    this.deltaTime = this.maintenant - this.avant;
	this.avant = this.maintenant;
	
	console.log('step');
	console.log(this.deltaTime);
	// Si c'est la dernière iteration (fin de l'animation)
	
	// Pour chaque propriété
	for(i=0;i<this.ani.prop.length; i++)
	{
		step = (this.ani.fin[i]-this.ani.debut[i]) / (this.ani.delai/this.deltaTime);
		console.log('delai/deltaTime', this.ani.delai/this.deltaTime);
		console.log('step', step);
		console.log('condition', Math.abs(step) < Math.abs(this.ani.fin[i] - this.ani.valeur[i]));
		
		if(Math.abs(step) < Math.abs(this.ani.fin[i] - this.ani.valeur[i]))
		{
			this.ani.valeur[i] += step;
			if(this.ani.typeProp[i] == 'DOM')
			{
				this.ani.element[this.ani.prop[i]] = this.ani.valeur[i];
			}
			else if(this.ani.typeProp[i] == 'CSS')
			{
				this.ani.element.style[this.ani.prop[i]] = this.ani.valeur[i] +this.ani.unite[i];
			}
			
		}
		else
		{
			this.ani.valeur[i] += step;
			if(this.ani.typeProp[i] == 'DOM')
			{
				this.ani.element[this.ani.prop[i]] = this.ani.fin[i];
			}
			else if(this.ani.typeProp[i] == 'CSS')
			{
				this.ani.element.style[this.ani.prop[i]] = this.ani.fin[i]+this.ani.unite[i];
			}
			this.ani.statut = this.statut.fin;
			if(this.ani.callback)
			{
				this.ani.callback();	// Appel de la fonction callback.
			}
		}
		
		
	}
	if(this.ani.statut != this.statut.fin)
	{
		requestAnimationFrame(this.animationStep.bind(this));
	}
};

Anim.prototype.demarre = function()
{
	"use strict";
	this.avant = Date.now()-16;
	this.deltaTime = 16;
	this.ani.statut = this.statut.demarrer;
	this.animationStep();
	
	//requestAnimationFrame(this.animationStep.bind(this));
};


// http://creativejs.com/resources/requestanimationframe/
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
