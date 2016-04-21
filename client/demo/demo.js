function addModal(element){
  var modals = document.querySelector(".modals");
  modals.appendChild(element);
  modals.style.display = null;
}

function removeModal(element){
  var modals = document.querySelector(".modals");
  modals.removeChild(element);
  if(modals.childNodes.length===0){
    modals.style.display = "none";
  }
}

function getCardSelection(prompt,filter){
  var cards = [].concat(
    Object.keys(grid.ponies).map(function(k){return grid.ponies[k];}),
    Object.keys(grid.ships).map(function(k){return grid.ships[k];})
  ).filter(filter).map(function(c){return {text:c.name+" ("+c.effect+")",value:c};});
  cards.push({text:"Cancel",value:false});
  return getUserSelection(prompt,cards).then(function(n){
    if (n === false) throw "Canceled";
    return n;
  });
}

function getUserInput(prompt,type){
  return new Promise(function(good,bad){
    var modal = document.createElement("form"),
        input = document.createElement("input");
    input.type = type;
    input.placeholder = prompt;
    modal.onsubmit = function(){
      good(input.value);
      removeModal(modal);
      return false;
    };
    modal.appendChild(input);
    addModal(modal);
    input.focus();
  });
}

function getUserSelection(prompt,options){
  return new Promise(function(good,bad){
    var modal = document.createElement("form"),
        submit = function(val){
          good(val);
          removeModal(modal);
          return false;
        };
    modal.textContent = prompt;
    options.forEach(function(n){
      var selection = document.createElement("button");
      selection.textContent = n.text;
      selection.onclick = submit.bind(null,n.value);
      modal.appendChild(selection);
    });
    addModal(modal);
  });
}

function showError(err){
  var modal = document.createElement("div");
  modal.onclick = function(){
    removeModal(modal);
  };
  modal.textContent = err;
  addModal(modal);
}
var game = new Game(document.querySelector("canvas")),
    grid = new Grid(),
    hand = new Hand();

game.addAsChild("grid",grid,0,0,680,680);
game.addAsChild("hand",hand,0,680,680,150);

var ws;
try {
  ws = new WebSocket("ws://" + location.host + location.search);
} catch(e) {
  console.warn("Websocket failed, trying longpoll fallback");
  ws = new LongPoll("../ws",location.search);
}
ws.onmessage = function(msg){
  var data = JSON.parse(msg.data),
      handler = handlers[data.type];
  if(typeof(data) !== 'object'){
    console.warn("Data is not a object origional data:",msg.data);
  }
  if(handler === undefined){
    console.warn("No handler for ",data.type,data);
  } else {
    handlers[data.type](data);
  }
};

ws._send = ws.send;
ws.send = function(data){
  ws._send(JSON.stringify(data));
};

document.querySelector("#chat form").onsubmit = function(e){
  ws.send({type:"chat",msg:this.childNodes[0].value});
  this.childNodes[0].value = "";
  return false;
};
