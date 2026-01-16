/* Tiles are the basic unit of the game. They'll have a location and can be 
  occupied by e.g. a wolf, a goat, or nothing at all.
*/

class Tile {
  constructor(name, bankSide, permittedOccupants = [], occupiedBy = "empty") {
    this.name = name;
    this.bankSide = bankSide;
    this.occupiedBy = occupiedBy;
    this.permittedOccupants = permittedOccupants;
  }
}

// function declarations

function displayRules() {
  const element = document.getElementById("instructions");

  element.style.visibility = "visible";
  element.addEventListener("click", function () {
    hideRules();
  });
}

function hideRules() {
  const element = document.getElementById("instructions");

  element.style.visibility = "hidden";
}

function showMessage() {
  const element = document.getElementById("messages");
  element.style.visibility = "visible";
}
function hideMessage() {
  const element = document.getElementById("messages");
  element.style.visibility = "hidden";
}

function hideStartScreen() {
  const element = document.getElementById("start-screen");
  element.style.visibility = "hidden";
}

function showStartScreen() {
  const element = document.getElementById("start-screen");
  element.style.visibility = "visible";
}

function showWinScreen() {
  const element = document.getElementById("win-screen");
  element.style.visibility = "visible";
}

function hideWinScreen() {
  const element = document.getElementById("win-screen");
  element.style.visibility = "hidden";
}

function resetGame() {
  resetTiles();
  hideWinScreen();
}

function freezeTiles() {
  tiles.forEach((tile) => {
    document.getElementById(tile.name).style.pointerEvents = "none";
  });
}

function unfreezeTiles() {
  tiles.forEach((tile) => {
    document.getElementById(tile.name).style.pointerEvents = "auto";
  });
}

function resetTiles() {
  tiles.forEach((tile) => {
    if (tile.name == "top-bank-1") {
      tile.occupiedBy = "wolf";
    } else if (tile.name == "top-bank-2") {
      tile.occupiedBy = "goat";
    } else if (tile.name == "top-bank-3") {
      tile.occupiedBy = "cabbages";
    } else if (tile.name == "top-boat") {
      tile.occupiedBy = "boat";
    } else {
      tile.occupiedBy = "empty";
    }

    const element = document.getElementById(tile.name);
    if (element) {
      if (tile.occupiedBy == "empty") {
        element.style.visibility = "hidden";
      }
      else {
        element.innerHTML = `<img src="assets/images/${tile.occupiedBy}.png" alt="${tile.occupiedBy}" style="width: 100%; height: 100%;">`;
        element.style.visibility = "visible";
      }
    }
  });
}

function resetApp() {
  resetGame();
  hideWinScreen();
  showStartScreen();
}

function flashRed(tile) {
  const turnRedElement = document.getElementById(tile.name);

  turnRedElement.style.borderColor = "#ff0000";
  setTimeout(() => {
    turnRedElement.style.borderColor = "rgb(0, 83, 0)";
  }, 1000);
}

function growShrink(tile) {
  const growShrinkElement = document.getElementById(tile.name);
  growShrinkElement.classList.add("grow-shrink");
}

function switchGrowShrinkOff(tile) {
  const growShrinkElement = document.getElementById(tile.name);

  growShrinkElement.classList.remove("grow-shrink");
}

function warnPlayer(tile) {
  flashRed(tile);

  if (tile.bankSide == "top") {
    let shakingelement = document.getElementById(topBoatCargo.name);
    shakingelement.classList.add("shaking");
    shakingelement = document.getElementById(topBoat.name);
    shakingelement.classList.add("shaking");
  } else {
    let shakingelement = document.getElementById(bottomBoatCargo.name);
    shakingelement.classList.add("shaking");
    shakingelement = document.getElementById(bottomBoat.name);
    shakingelement.classList.add("shaking");
  }
  freezeTiles();
  showMessage();
  document.getElementById("messages").innerText =
    "If you move the boat right now, something will get eaten! (Click to continue)";

  const element = document.getElementById("messages");
  element.addEventListener("click", function () {
    hideMessage();
    unfreezeTiles();
  });
}

/* handle menu buttons */

document.getElementById("start-game-button")
  .addEventListener("click", hideStartScreen);

document.getElementById("instructions-button")
  .addEventListener("click", displayRules);

document.getElementById("play-again-button")
  .addEventListener("click", resetGame);

document.getElementById("return-main-button")
  .addEventListener("click", resetApp);

/* Initialise game tiles */

let topBank1 = new Tile("top-bank-1", "top", ["empty", "wolf"], "wolf");
let topBank2 = new Tile("top-bank-2", "top", ["empty", "goat"], "goat");
let topBank3 = new Tile("top-bank-3", "top", ["empty", "cabbages"], "cabbages");
let topBoatCargo = new Tile(
  "top-boat-cargo",
  "top"[("empty", "goat", "wolf", "cabbages")],
  "empty"
);
let topBoat = new Tile("top-boat", "top", ["empty", "boat"], "boat");
let bottomBoat = new Tile("bottom-boat", "bottom", ["empty", "boat"], "empty");
let bottomBoatCargo = new Tile(
  "bottom-boat-cargo",
  "bottom",
  ["empty", "goat", "wolf", "cabbages"],
  "empty"
);
let bottomBank1 = new Tile(
  "bottom-bank-1",
  "bottom",
  ["empty", "wolf"],
  "empty"
);
let bottomBank2 = new Tile(
  "bottom-bank-2",
  "bottom",
  ["empty", "goat"],
  "empty"
);
let bottomBank3 = new Tile(
  "bottom-bank-3",
  "bottom",
  ["empty", "cabbages"],
  "empty"
);

const tiles = [
  topBank1,
  topBank2,
  topBank3,
  topBoatCargo,
  topBoat,
  bottomBoat,
  bottomBoatCargo,
  bottomBank1,
  bottomBank2,
  bottomBank3,
];

/* main game logic below */

tiles.forEach((tile) => {
  let element = document.getElementById(tile.name);
  if (element) {
    if (tile.occupiedBy != "empty") {
    element.innerHTML = `<img src="assets/images/${tile.occupiedBy}.png" alt="${tile.occupiedBy}" style="width: 100%; height: 100%;">`;
    }
    else {
      element.style.visibility = "hidden";
    }

    element.addEventListener("click", function () {
      tiles.forEach((tile) => {
        element = document.getElementById(tile.name);

        /*on each click, switch off the shaking effect on all tiles*/

        if (element.classList.contains("shaking")) {
          element.classList.remove("shaking");
        }

        document.getElementById("messages").innerText = "";
      });

      /* main logic for tile movement */

      /* case where the tile is one of the top bank ones */
      if ([topBank1, topBank2, topBank3].includes(tile)) {
        if (tile.occupiedBy != "empty") {
          if (
            topBoatCargo.occupiedBy == "empty" &&
            topBoat.occupiedBy != "empty"
          ) {
            if (tile == topBank1) {
              topBoatCargo.occupiedBy = "wolf";
            }

            if (tile == topBank2) {
              topBoatCargo.occupiedBy = "goat";
            }

            if (tile == topBank3) {
              topBoatCargo.occupiedBy = "cabbages";
            }

            tile.occupiedBy = "empty";
          }
        }
      }
      if (tile == topBoatCargo) {
        if (topBoatCargo.occupiedBy == "wolf") {
          topBank1.occupiedBy = "wolf";
        }

        if (topBoatCargo.occupiedBy == "goat") {
          topBank2.occupiedBy = "goat";
        }
        if (topBoatCargo.occupiedBy == "cabbages") {
          topBank3.occupiedBy = "cabbages";
        }

        topBoatCargo.occupiedBy = "empty";
      }

      if (tile == topBoat) {
        if (
          tile.occupiedBy == "boat" &&
          !(topBank1.occupiedBy == "wolf" && topBank2.occupiedBy == "goat") &&
          !(topBank2.occupiedBy == "goat" && topBank3.occupiedBy == "cabbages")
        ) {
          /*move boat*/
          bottomBoat.occupiedBy = "boat";
          bottomBoatCargo.occupiedBy = topBoatCargo.occupiedBy;

          topBoatCargo.occupiedBy = "empty";
          topBoat.occupiedBy = "empty";
        }

        // behaviour when illegal move is made
        else {
          warnPlayer(tile);
        }
      }

      if (tile == bottomBoat) {
        //we cannot leave these pairs alone on the south bank:
        // wolf and goat
        // goat and cabbages
        //
        if (
          tile.occupiedBy == "boat" &&
          !(
            bottomBank1.occupiedBy == "wolf" && bottomBank2.occupiedBy == "goat"
          ) &&
          !(
            bottomBank2.occupiedBy == "goat" &&
            bottomBank3.occupiedBy == "cabbages"
          )
        ) {
          topBoat.occupiedBy = "boat";
          topBoatCargo.occupiedBy = bottomBoatCargo.occupiedBy;

          bottomBoatCargo.occupiedBy = "empty";
          bottomBoat.occupiedBy = "empty";
        } else {
          warnPlayer(tile);
        }
      }

      if (tile == bottomBoatCargo) {
        if (bottomBoatCargo.occupiedBy == "wolf") {
          bottomBank1.occupiedBy = "wolf";
        }

        if (bottomBoatCargo.occupiedBy == "goat") {
          bottomBank2.occupiedBy = "goat";
        }
        if (bottomBoatCargo.occupiedBy == "cabbages") {
          bottomBank3.occupiedBy = "cabbages";
        }

        bottomBoatCargo.occupiedBy = "empty";
      }

      if ([bottomBank1, bottomBank2, bottomBank3].includes(tile)) {
        if (tile.occupiedBy != "empty") {
          if (
            bottomBoatCargo.occupiedBy == "empty" &&
            bottomBoat.occupiedBy != "empty"
          ) {
            if (tile == bottomBank1) {
              bottomBoatCargo.occupiedBy = "wolf";
            }

            if (tile == bottomBank2) {
              bottomBoatCargo.occupiedBy = "goat";
            }

            if (tile == bottomBank3) {
              bottomBoatCargo.occupiedBy = "cabbages";
            }

            tile.occupiedBy = "empty";
          }
        }
      }

      tiles.forEach((tile) => {

        element = document.getElementById(tile.name);

        if (tile.occupiedBy == "empty") {
          element.style.visibility = "hidden";
        } else if (tile.occupiedBy != "empty") {
          document.getElementById(
            tile.name
          ).innerHTML = `<img src="assets/images/${tile.occupiedBy}.png" alt="${tile.occupiedBy}" style="width: 100%; height: 100%;">`;
          element.style.visibility = "visible";
        }
      });

      /* win condition */

      if (
        bottomBank1.occupiedBy == "wolf" &&
        bottomBank2.occupiedBy == "goat" &&
        bottomBank3.occupiedBy == "cabbages"
      ) {
        [bottomBank1, bottomBank2, bottomBank3].forEach((tile) => {
          growShrink(tile);
          setTimeout(() => {
            switchGrowShrinkOff(tile);
          }, 2000);
        });

        setTimeout(() => {
          showWinScreen();
        }, 2000);
      }
    });
  }
});