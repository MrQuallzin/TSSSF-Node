function inList(item,list){
  //TODO: maybe check if list isn't a list...
  return list.indexOf(item) >= 0;
}
function samePonyGroupFilter(count){
  return function(cards){
    var names = {},
        highCount = 0;
    cards.forEach(function(card){
      if( names[card.ponyName] === undefined){
        names[card.ponyName] = [card];
      } else {
        names[card.ponyName].push(card);
      }
      if(names[card.ponyName].length > highCount){
        highCount = names[card.ponyName].length;
        if(highCount > count){
          return true;
        }
      }
    });
    return false;
  };
}

/**
 * Returns a filter function, which returns true if none of the filters fail
 * @param  {object} filterObject The filter object
 * @return {function}            The filter function
 */
function cardFilter(filterObject){
  return function(card){
    var filterParts = Object.keys(filterObject);
    for(var i = 0;i<filterParts.length;i++){
      var cardValue = [],
          filterValue = filterObject[filterParts[i]],
          match = false;
      switch (filterParts[i]){
        case "keyword":
          cardValue = card.keywords;
          break;
        case "race":
          cardValue = card.race;
          break;
        case "name":
          cardValue = card.ponyName;
          break;
        case "gender":
          cardValue = card.gender;
          break;
        case "extraIcon":
          cardValue = card.extraIcon;
          break;
        case "count":
          continue; //Ignore count, it's not used here
        default:
          console.warning(filterParts[i]+" is not one of the known filter types");
          continue;
      }
      if (!Array.isArray(cardValue)){
        cardValue = [cardValue];
      }
      if (!Array.isArray(filterValue)){
        filterValue = [filterValue];
      }
      for (var j=0;j<filterValue.length && !match;j++){
        if(cardValue.indexOf(filterValue[j]) >= 0){
          match = true;
        }
      }
      if(!match){
        return false;
      }
    }
    return true;
  };
}

/*
Goal Logic Type:
  Pony: Refers to 1 or more pony cards
  Ship: Refers to a single pony being shipped with 1 or more cards
  Ship Card: Refers to 1 or more ship cards (as aposed to the ship)
  Chain: Refers to a chain of ponies shipped together

Goal Logic methods:
  Create: Completing the condition in a single play (may already be partly completed)
  Exists: The condition must be true at any ponint, may already be true
  Play: Completing the condition with plays only made this turn
  Destroy: Removing the given pony, breaking up a ship or chain
  Swap: Swapping 2 or more ponies on the grid (each pony counts inivially)
  Modify: You change a pony card's keyword ect, has "from" and "too" instead of "cards"

Hooks:
  Pony
    Create/Exists/Play: Pony Play
    Swap: Pony Moved
    Destroy: Pony Removed
    Modify: Pony Modified
  Ship:
    Create/Exists/Play: Ship Formed
    Destroy: Ship Destroy
  Ship Card:
    Create/Exists/Play: Ship Card Play

3 Basic plays:
  Pony & Ship: PonyA, PonyB, Ship
    Pony Play: PonyA
    Ship Card Play: Ship
    Ship Formed: PonyA, Ship, PonyB
  Ship only: PonyA, PonyB, Ship
    Ship Card Play: Ship
    Ship Formed: PonyP, PonyR
  Replace:
    Pony Destory: PonyR
      Ship Destroy: [All ships with PonyR]
    Pony Play: PonyP
      Ship Form: [All the new ships]
  

Not implemented/Partly implemnted goal cards:
 - Pomf!
 - Friendship is benefits (missing 4 points)
 - Time Travelers Among Us
 - It's Magical: Horns Are Touching
 - It's not evil
 - Needs More Lesbians
 - Quite
 - Shipwrecker
 - Invasive species
 - Go Forth and Multiply
 - Budding Curiosity
 - Charity Auction
*/
