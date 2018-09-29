"use strict";

var Pokemon = function Pokemon(ndid, options) {
  $.getJSON("/lib/PokeAPI/api/v2/pokemon/" + ndid + "/index.json", (function (d) {
    var fncFillBaseProperties = function fncFillBaseProperties(obj, data) {
      var dProps = Object.getOwnPropertyNames(data);
      for (var len = dProps.length, n = 0; n < len; n++) {
        obj[dProps[n]] = data[dProps[n]];
      }
    };
    fncFillBaseProperties(this, d);

    var fncFillProperties = (function (prop, subProp) {
      if (prop in this) {
        for (var len = this[prop].length, n = 0; n < len; n++) {
          if (typeof subProp !== "undefined" && subProp !== null && subProp in this[prop][n]) {
            if ("url" in this[prop][n][subProp]) {
              $.getJSON("/lib/PokeAPI" + this[prop][n][subProp].url + "/index.json", (function (d) {
                fncFillBaseProperties(this, d);
              }).bind(this[prop][n][subProp]));
            }
          } else if ("url" in this[prop][n]) {
            $.getJSON("/lib/PokeAPI" + this[prop][n].url + "/index.json", (function (d) {
              fncFillBaseProperties(this, d);
            }).bind(this[prop][n]));
          }
        }
      }
    }).bind(this);
    if (typeof options !== "undefined" && options !== null) {
      if ("includes" in options) {
        if ("abilities" in options.includes && options.includes.abilities === true) {
          fncFillProperties("abilities", "ability");
        }
        if ("forms" in options.includes && options.includes.forms === true) {
          fncFillProperties("forms");
        }
        if ("game_indicies" in options.includes && options.includes.game_indicies === true) {
          fncFillProperties("game_indices", "version");
        }
        if ("moves" in options.includes && options.includes.moves === true) {
          fncFillProperties("moves", "move");
        }
        if ("species" in options.includes && options.includes.species === true) {
          this["species"] = $.getJSON(this.species.url);
        }
        if ("stats" in options.includes && options.includes.stats === true) {
          fncFillProperties("stats", "stat");
        }
        if ("types" in options.includes && options.includes.types === true) {
          fncFillProperties("types", "type");
        }
      }
    }
  }).bind(this));
  this["_options"] = options;

  this["UI"] = {
    Create: (function (parent, clear) {
      if (typeof clear === "undefined" || clear === null) {
        clear = true;
      }
      var eTemps = parent.querySelectorAll(".poke-card");
      if (clear && eTemps.length > 0) {
        for (var len = eTemps.length, n = 0; n < len; n++) {
          parent.removeChild(eTemps[n]);
        }
      }
      var template = document.querySelector("#pokeCard").content.cloneNode(true);

      parent.appendChild(template);
      var strTemplate = "";

      var eSrcs = parent.querySelectorAll("[src*='{'][src*='}']");
      for (var slen = eSrcs.length, s = 0; s < slen; s++) {
        var selem = eSrcs[s];
        strTemplate = selem.getAttribute("src").replace("{", "").replace("}", "");
        selem.setAttribute("src", eval("this['" + strTemplate.split(".").join("']['") + "']"));
      }
      var elems = parent.querySelectorAll("[name*='{'][name*='}']");
      for (var alen = elems.length, a = 0; a < alen; a++) {
        var elem = elems[a];
        strTemplate = elem.getAttribute("name").replace("{", "").replace("}", "");
        elem.innerText = eval("this['" + strTemplate.split(".").join("']['") + "']");
      }
      return template;
    }).bind(this)
  };

  return this;
};

