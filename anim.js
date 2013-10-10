/*global clearInterval: false, clearTimeout: false, document: false, event: false, frames: false, history: false, Image: false, location: false, name: false, navigator: false, Option: false, parent: false, screen: false, setInterval: false, setTimeout: false, window: false, XMLHttpRequest: false */
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

function Anim(ani, frameRate)
{
	"use strict";
	var erreur;
	if(ani)
	{
		this.ani = ani;
	}
	else
	{
		throw new TypeError("L'animation n'est pas définie");
		
	}
	
	
	if(frameRate)
	{
		this.setFrameRate(frameRate);
	}
	else
	{
		this.setFrameRate(60);
	}
	
	if(this.ani)
	{
		this.prepAnim();
	}
	
}
Anim.prototype.setFrameRate = function(frameRate)
{
	"use strict";
	if(frameRate)
	{
		this.frameRate = frameRate;
		this.deltaTime = 1000/this.frameRate;
		
	}
};

/**
* Fonction qui prépare l'animation. elle calcul le nombre d'iteration nécessaire et le pas (la valeur de changement pour chaque frame) de chaque déplacement.
**/
Anim.prototype.prepAnim = function()
{
	"use strict";
	var i;
	var valeur;
	this.ani.inter = [];
	this.ani.typeProp = [];
	
	// Calcul du nombre d'iteration
	this.ani.iteration = this.ani.delai / this.deltaTime;
//TODO : Vérifier l'existence de la propriété et son attachement (CSS ou DOM Element)

	// Pour chaque propriété à animer.
	for(i=0;i<this.ani.prop.length; i++)
	{
		// Vérifier le type de propriété (CSS ou DOM)
		console.log(this.ani.element[this.ani.prop[i]]);
		if(this.ani.element[this.ani.prop[i]] !== undefined && this.ani.element[this.ani.prop[i]] !== null)	// Prop DOM
		{
			this.ani.typeProp[i] = 'DOM';
			
			// Lecture de la valeur actuelle
			valeur = parseFloat(this.ani.element[this.ani.prop[i]]);
		}
		else
		{
			this.ani.typeProp[i] = 'CSS';
			
			// Lecture de la valeur actuelle
			valeur = window.getComputedStyle(this.ani.element,null).getPropertyValue(this.ani.prop[i]);		// BUG : Dans Chrome, valeur == auto et non la valeur calculée
			valeur = parseFloat(valeur);
		}
	
		console.log(valeur);
				
		// Calcul du pas
		this.ani.inter[i] = (this.ani.fin[i] - valeur) / (this.ani.delai / this.deltaTime);
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
	var valeur;
	console.log('step');
	// Si c'est la dernière iteraction (fin de l'animation)
	if(this.ani.iteration <=1)
	{
		// Pour chaque propriété
		for(i=0;i<this.ani.prop.length; i++)
		{
			if(this.ani.typeProp[i] == 'DOM')
			{
				this.ani.element[this.ani.prop[i]] = this.ani.fin[i];
			}
			else if(this.ani.typeProp[i] == 'CSS')
			{
				this.ani.element.style[this.ani.prop[i]] = this.ani.fin[i]+this.ani.unite[i];
			}
		}
		// S'il y a un callback
		if(this.ani.callback)
		{
			this.ani.callback();	// Appel de la fonction callback.
		}
	}
	else
	{
		// Pour chaque propriété
		for(i=0;i<this.ani.prop.length; i++)
		{
			if(this.ani.typeProp[i] == 'DOM')
			{
				valeur = parseFloat(this.ani.element[this.ani.prop[i]]);
				this.ani.element[this.ani.prop[i]] = (valeur + this.ani.inter[i]);
				
			}
			else if(this.ani.typeProp[i] == 'CSS')
			{
				//Lecture de la valeur actuelle
				valeur = window.getComputedStyle(this.ani.element,null).getPropertyValue(this.ani.prop[i]);
				// Retirer les unites
				valeur = parseFloat(valeur);
				// Affectation de la nouvelle valeur (valeur actuelle + interval (ou le pas)
				this.ani.element.style[this.ani.prop[i]] = (valeur + this.ani.inter[i])+this.ani.unite[i];
			}
		}

		// Une de moins à faire...
		this.ani.iteration --;

		// Redémarre l'animation dans deltaTime.
		setTimeout(this.animationStep.bind(this), this.deltaTime);
	}
};

Anim.prototype.demarre = function()
{
	"use strict";
	this.animationStep();
};

