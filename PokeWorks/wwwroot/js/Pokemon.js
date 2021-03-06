﻿jQuery.extend({
  getCachedJSON: function (url, callback) {
    var cacheTimeInMs = 3600000;
    var currentTimeInMs = new Date().getTime();
    url = url.replace("//index.json", "/index.json");
    var cache = {
      data: null,
      timestamp: null
    };

    //if (typeof window.localStorage[url] !== "undefined") {
    //  cache = JSON.parse(window.localStorage[url]);

    //  var validCache = (currentTimeInMs - cache.timestamp) < cacheTimeInMs;

    //  if (validCache) {
    //    callback(cache.data);
    //    return true;
    //  }
    //}

    $.getJSON(url, function (data) {
      cache.data = data;
      cache.timestamp = new Date().getTime();

      window.localStorage[url] = JSON.stringify(cache);

      callback(cache.data);
    });
  }
});
const gtet = "greater than or equal to";
const ltet = "less than or equal to";
const gt = "greater than";
const lt = "less than";
const et = "equal to";
var EvolveOptions = {
  "gender": {
    "label": "Gender Equals:"
  },
  "held_item": {
    "label": "Holding Item:"
  },
  "item": {
    "label": "Holding Item:"
  },
  "known_move": {
    "label": "Knows Move:"
  },
  "known_move_type": {
    "label": "Knows Move-Type:"
  },
  "location": {
    "label": "At Location:"
  },
  "min_affection": {
    "label": "Gaining Affection " + gtet
  },
  "min_beauty": {
    "label": "Building Beauty " + gtet
  },
  "min_happiness": {
    "label": "Gaining Happiness " + gtet
  },
  "min_level": {
    "label": "Gaining at least Level:"
  },
  "needs_overworld_rain": {
    "label": "When Raining"
  },
  "party_species": {
    "label": "Accompanied By Species:"
  },
  "party_type": {
    "label": "Accompanied By Pokemon Type:"
  },
  "relative_physical_stats": {
    "label": "Stats:"
  },
  "time_of_day": {
    "label": "Time of Day:"
  },
  "trade_species": {
    "label": "When Traded"
  }
};
var StatsOptions = {
  "speed": {
    "label": "Speed"
  },
  "special-defense": {
    "label": "Special Defense"
  },
  "special-attack": {
    "label": "Special Attack"
  },
  "defense": {
    "label": "Defense"
  },
  "attack": {
    "label": "Attack"
  },
  "hp": {
    "label": "HP"
  }
};

$.fn.pokeCard = function (data) {
  return $(this).filter(function (i, e) {
    console.log("Checking pokeCard class: ", e);
    return e.classList.contains("poke-card");
  }).each(function (i, e) {
    console.log("Initializing Poke-Card: ", data);
    var $this = $(this);
    var el = $this[0];
    var fncHasProp = (function (prop, fncCreate) {
      if (!(prop in this)) {
        this[prop] = fncCreate.apply(this);
      }
    }).bind(el);

    // Build .poke-card with Vanilla JS
    fncHasProp("elSprite", function () {
      var e = this.appendChild(document.createElement("img"));
      e.setAttribute("class", "sprite");
      e.setAttribute("src", "");
      e.setAttribute("alt", "Pokemon Image");

      e["Draw"] = (function () {
        var ap = this["ActivePokemon"];
        if (typeof ap !== "undefined" && ap !== null) {
          this.elSprite.src = ap.sprites.front_default;
        } else {
          this.elSprite.src = "/images/404-pokemon.png";
        }
        return this.elSprite;
      }).bind(this);

      return e;
    });
    fncHasProp("elName", function () {
      var e = this.appendChild(document.createElement("h1"));
      e.innerText = "#";
      var sDexNum = e.appendChild(document.createElement("span"));
      sDexNum.setAttribute("title", "National Pokedex #");
      sDexNum.setAttribute("aria-label", "National Dex Number");
      sDexNum.setAttribute("name", "{['id']}");
      e.innerHTML += "&nbsp;";
      var sName = e.appendChild(document.createElement("span"));
      sName.setAttribute("title", "Pokemon Name");
      sName.setAttribute("aria-label", "Name");
      sName.setAttribute("name", "{['name']}");

      e["Draw"] = (function () {
        var ap = this["ActivePokemon"];
        if (typeof ap !== "undefined" && ap !== null) {
          // Set 'Dex Number
          this.elName.querySelector("[aria-label='National Dex Number']").innerText = ap.id.toString();
          // Set Name
          this.elName.querySelector("[aria-label='Name']").innerText = ap.name.substr(0,1).toUpperCase() + ap.name.substr(1);
        } else {
          // Set 'Dex Number
          this.elName.querySelector("[aria-label='National Dex Number']").innerHTML = "&mdash;";
          // Set Name
          this.elName.querySelector("[aria-label='Name']").innerHTML = "&mdash;";
        }

        return this.elName;
      }).bind(this);

      return e;
    });
    fncHasProp("elGenus", function () {
      var e = this.appendChild(document.createElement("h4"));
      e.setAttribute("title", "Genuse Name");
      e.setAttribute("aria-label", "Genus Name");
      e.setAttribute("name", "{['species']['genera'][2]['genus']}");

      e["Draw"] = (function () {
        var ap = this["ActivePokemon"];
        if (typeof ap !== "undefined" && ap !== null) {
          this.elGenus.innerText = ap.species.genera[2].genus;
        } else {
          this.elGenus.innerHTML = "&mdash;";
        }
        return this.elGenus;
      }).bind(this);

      return e;
    });
    fncHasProp("elPokeEvolutions", function () {
      var e = this.appendChild(document.createElement("div"));
      e.setAttribute("class", "poke-evolutions");
      var elLabel = e.appendChild(document.createElement("h6"));
      elLabel.innerText = "Next Evolutionary Form(s)";
      var elUL = e.appendChild(document.createElement("ul"));

      e["Draw"] = (function () {
        var ap = this["ActivePokemon"];
        this.elPokeEvolutions.classList.toggle("hidden", true);
        this.removeAttribute("data-evolves-from-id");
        this.removeAttribute("data-evolves-from-name");
        this.removeAttribute("data-evolves-to-id");
        this.removeAttribute("data-evolves-to-name");
        if (typeof ap !== "undefined" && ap !== null) {
          // Focus on next evolutionary form(s)
          var ul = this.elPokeEvolutions.querySelector("ul");
          ul.innerHTML = "";
          var nextPokemons = ap.Get.Evolution.Next();
          if (nextPokemons !== null && nextPokemons.length > 0) {
            var tks = Object.getOwnPropertyNames(EvolveOptions);
            for (var len = nextPokemons.length, n = 0; n < len; n++) {
              if (nextPokemons[n].evolution_details.length > 0) {
                var evolution = nextPokemons[n].evolution_details[0];
                var li = ul.appendChild(document.createElement("li"));
                li.setAttribute("data-evolves-to", nextPokemons[n].species.name);
                var arrTriggers = new Array();
                for (var tlen = tks.length, t = 0; t < tlen; t++) {
                  var trigger = evolution[tks[t]];
                  if (trigger !== null && trigger !== false && trigger !== "") {
                    arrTriggers.push(EvolveOptions[tks[t]].label + " <strong>" + trigger.toString()) + "</strong>";
                  }
                }
                li.innerHTML = "<strong>" + nextPokemons[n].species.name.substr(0, 1).toUpperCase() + nextPokemons[n].species.name.substr(1) + "</strong> by " + arrTriggers.join("<br/>&mdash; ");
                var lia = li.appendChild(document.createElement("a"));
                lia.setAttribute("class", "btn btn-xs btn-default");
                lia.innerHTML = "<i class=\"glyphicon glyphicon-circle-arrow-right\"></i>";
                lia.setAttribute("data-evolves-to-id", nextPokemons[n].id.toString());
                lia.addEventListener("onclick", (function (el) {
                  $(".poke-loader").toggleClass("show", true);
                  data.pokemon = el.getAttribute("data-evolves-to-id");
                  $(el).closest(".poke-card").pokeCard(data);
                }).bind(this));
              }
            }
            this.elPokeEvolutions.classList.toggle("hidden", false);
          }
        }
        return this.elPokeEvolutions;
      }).bind(this);

      return e;
    });
    fncHasProp("elPokeStats", function () {
      var e = this.appendChild(document.createElement("div"));
      e.setAttribute("class", "poke-stats");
      var elCanv = e.appendChild(document.createElement("canvas"));
      elCanv.innerText = "This browser does not support HTML5 Canvas!";

      e["Draw"] = (function () {
        var ap = this["ActivePokemon"];
        var canv = this.elPokeStats.querySelector("canvas");
        var ctx;
        var blnCanv = typeof canv !== "undefined" && canv !== null;
        if (typeof ap !== "undefined" && ap !== null && blnCanv) {
          var r = canv.getBoundingClientRect();
          canv.width = r.width;
          canv.height = r.height;
          ctx = canv.getContext("2d");

          var sh = r.height / (ap.stats.length);
          var sa = sh * 0.5;
          var sw = r.width * 0.5;
          var fs = sh * 0.5;
          ctx.font = fs.toString() + "px Arial";
          for (var len = ap.stats.length, n = 0; n < len; n++) {
            var stat = ap.stats[n];
            var ba = {
              x: r.width * 0.5,
              y: (sh * n) + (sh / 2) - (sa / 2),
              w: sw * (stat.base_stat / 255),
              h: sa
            };
            var bb = {
              x: ba.x,
              y: ba.y,
              w: sw,
              h: ba.h
            };
            var bt = {
              x: r.width * 0.45,
              y: (sh * n) + (sh / 2),
              w: r.width * 0.5,
              h: fs
            };
            ctx.fillStyle = ap.species.color.name;
            ctx.fillRect(ba.x, ba.y, ba.w, ba.h);
            ctx.strokeStyle = "black";
            ctx.strokeRect(bb.x, bb.y, bb.w, bb.h);
            ctx.fillStyle = "black";
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            ctx.fillText(StatsOptions[stat.stat.name].label + " (" + stat.base_stat.toString() + "): ", bt.x, bt.y, bt.w);
          }
        } else if (blnCanv) {
          ctx = canv.getContext("2d");
          ctx.fillStyle = "black";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("No Base Stats Available", canv.width / 2, canv.height / 2, canv.width * 0.75);
        }
        return this.elPokeStats;
      }).bind(this);

      return e;
    });

    el["Draw"] = (function () {
      var ap = this["ActivePokemon"];
      if (typeof ap !== "undefined" && ap !== null) {
        // Set Species Color
        if ("color" in ap.species) {
          this.setAttribute("data-species-color", ap.species.color.name);
        } else if (this.hasAttribute("data-species-color")) {
          this.removeAttribute("data-species-color");
        }

      }
      // Set Sprite image(s)
      this.elSprite.Draw();

      // Set Name Header
      this.elName.Draw();
      this.elGenus.Draw();
      this.elPokeEvolutions.Draw();
      this.elPokeStats.Draw();

      return this;
    }).bind(el);

    // Check for data
    if (typeof data === "undefined" || data === null) {
      data = {};
    }
    if (!("options" in data)) {
      data["options"] = {};
    }
    var pid = null;
    if (el.hasAttribute("data-pokemon")) {
      pid = el.getAttribute("data-pokemon");
    } else if ("pokemon" in data) {
      pid = data.pokemon;
    }
    data.options["jqueryPokeCardCallback"] = (function () {
      this.Draw();
    }).bind(el);
    if (typeof pid !== "undefined" && pid !== null) {
      this["ActivePokemon"] = new Pokemon(pid, data.options);
    }

    return $this;
  });
};

var Pokemon = function (ndid, options) {
  this._includes = {};

  $.getCachedJSON("/lib/PokeAPI/api/v2/pokemon/" + ndid + "/index.json", (function (d) {
    var fncFillBaseProperties = (function (data) {
      var dProps = Object.getOwnPropertyNames(data);
      for (var len = dProps.length, n = 0; n < len; n++) {
        this[dProps[n]] = data[dProps[n]];
      }
      return this;
    });
    fncFillBaseProperties.apply(this, [d]);
    var that = this;
    var fncFillProperties = (function (prop, options) {
      this.origin._includes[prop] = "pending";
      var fncCheckIncludes = (function (obj, options) {
        if (typeof (options) !== "undefined" && options !== null && "includes" in options) {
          var iks = Object.getOwnPropertyNames(options.includes);
          if (iks.length > 0) {
            for (var ilen = iks.length, i = 0; i < ilen; i++) {
              if (Object.getOwnPropertyNames(options.includes[iks[i]]).length > 0) {
                fncFillProperties.apply({ origin: this.origin, item: obj }, [iks[i], options.includes[iks[i]]]);
              } else {
                fncFillProperties.apply({ origin: this.origin, item: obj }, [iks[i]]);
              }
            }
          }
        }
      }).bind(this);
      var fncCompletedGET = (function (d) {
        fncFillBaseProperties.apply(this.item, [d]);
        fncCheckIncludes.apply(this.that, [this.item, this.options]);
        this.that.origin._includes[this.prop] = "done";
      });
      if (prop in this.item) {
        if ("length" in this.item[prop] && !("url" in this.item[prop])) {
          for (var len = this.item[prop].length, n = 0; n < len; n++) {
            if (typeof (options) !== "undefined" && options !== null && "target" in options) {
              if ("url" in this.item[prop][n][options.target]) {
                $.getCachedJSON("/lib/PokeAPI" + this.item[prop][n][subProp].url + "/index.json", fncCompletedGET.bind({ that: this, item: this.item[prop][n][options.target], prop: prop, options: options }));
              }
            } else if ("url" in this.item[prop][n]) {
              $.getCachedJSON("/lib/PokeAPI" + this.item[prop][n].url + "/index.json", fncCompletedGET.bind({ that: this, item: this.item[prop][n], prop: prop, options: options }));
            }
          }
        } else if ("url" in this.item[prop]) {
          $.getCachedJSON("/lib/PokeAPI" + this.item[prop].url + "/index.json", fncCompletedGET.bind({ that: this, item: this.item[prop], prop: prop, options: options }));
        } else {
          console.warn("[Pokemon.fncFillProperties] No array detected and no URL property available: ", this.item[prop]);
        }
      } else {
        console.warn("[Pokemon.fncFillProperties] No '" + prop + "' in item: ", this.item);
      }
    });
    // Process Initializing Options
    this["_options"] = options;
    if (typeof (options) !== "undefined" && options !== null) {
      if ("includes" in options) {
        var iks = Object.getOwnPropertyNames(options.includes);
        for (var len = iks.length, n = 0; n < len; n++) {
          if (Object.getOwnPropertyNames(options.includes[iks[n]]).length > 0) {
            fncFillProperties.apply({ origin: this, item: this }, [iks[n], options.includes[iks[n]]]);
          } else {
            fncFillProperties.apply({ origin: this, item: this }, [iks[n]]);
          }
        }
        this._includes["_interval"] = setInterval((function () {
          var ik = Object.getOwnPropertyNames(this._includes);
          var blnGood = true;
          for (var len = ik.length, n = 0; n < len; n++) {
            if (ik[n] !== "_interval" && this._includes[ik[n]] === "pending") {
              blnGood = false;
            }
          }
          if (blnGood) {
            clearInterval(this._includes._interval);
            this._options.callback.apply(this);
          }
        }).bind(this), 100);
      } else if ("callback" in options) {
        options.callback.apply(this);
      }
    }
  }).bind(this));


  // Set Data Simplification Functions
  this["Get"] = {
    Evolution: {
      _FindCurrent: (function () {
        var that = this;
        if ("species" in this) {
          if ("evolution_chain" in this.species) {
            if ("chain" in this.species.evolution_chain) {
              var fncRecFind = function (obj, name) {
                if (obj.species.name.toLowerCase() === name.toLowerCase()) {
                  return obj;
                } else if (obj["evolves_to"].length > 0) {
                  var tmp = null;
                  for (var len = obj["evolves_to"].length, n = 0; n < len; n++) {
                    tmp = fncRecFind(obj["evolves_to"][n], name);
                    if (typeof tmp !== "undefined" && tmp !== null) {
                      break;
                    }
                  }
                  return tmp;
                }
              };
              return fncRecFind(this.species.evolution_chain.chain, this.name);
            } else {
              console.warn("[Pokemon.Get.Evolution.Next] No Chain data available!");
            }
          } else {
            console.warn("[Pokemon.Get.Evolution.Next] No Evolutionary Chain data available!");
          }
        } else {
          console.warn("[Pokemon.Get.Evolution.Next] No Species data available!");
        }
        return null;
      }).bind(this),
      Next: (function () {
        var cur = this.Get.Evolution._FindCurrent("to");
        if (typeof cur !== "undefined" && cur !== null) {
          return cur.evolves_to;
        } else {
          return [];
        }
      }).bind(this),
      Previous: (function () {
        return null;
      }).bind(this)
    }
  };

  if (typeof options !== "undefined" && options !== null) {
    if ("jqueryPokeCardCallback" in options) {
      options.jqueryPokeCardCallback.apply(this);
    }
  }

  return this;
}