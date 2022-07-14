const body = document.querySelector("body");
let gameList = [];
let filteredListData = [];


async function getGameList() {
  try {
    // setting options for the request
    const gameListOptions = {
      method: 'GET',
      redirect: 'follow'
    }; 

    // making request and saving the response in the response object
    const response = await fetch(
      'https://www.cheapshark.com/api/1.0/games?title=swordartonline&exact=0',
      gameListOptions
    ); 

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    // Extracting data from response object as JSON
    const listData = await response.json(); 
    return listData;
  } catch (err) {
    console.error(err);
  }
}

async function getGameInfo(id) {
  try {
    // setting options for the request
    const gameInfoOptions = {
      method: 'GET',
      redirect: 'follow'
    }; 

    // making request and saving the response in response object
    const response = await fetch(
      `https://www.cheapshark.com/api/1.0/games?id=${id}`,
      gameInfoOptions
    );

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    // Extracting data from response object as JSON
    const gameData = await response.json();
    return gameData;
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', e => {
  getGameList() // let's do this and the filtering on page load
    .then(listData => {
      gameList = listData;
      console.log("This is gameList: " + gameList);
      const filteredListData = listData
        .map(({ thumb, external, cheapest }) => {
          return {
            thumb: thumb,
            title: external,
            cheapest: cheapest
          };
      });
      
      console.log("This is filteredListData: " + filteredListData);

      paintGameList(gameList);
    })
});

function paintGameList(games) {
  // create grid container
  const listContainer = document.createElement("div");
  listContainer.classList.add("grid", "flow-grid", "game-list");

  // make grid items for each game in the list
  games.forEach(gameObj => {
    // set up outer elements
    const [anchorWrap, imgDiv, gameDiv] = 
    [
      document.createElement("a"),
      document.createElement("div"),
      document.createElement("div")
    ];
    anchorWrap.classList.add("anchor-wrap");
    anchorWrap.setAttribute("href", "#");
    gameDiv.classList.add("game-div");
    imgDiv.classList.add("blur", "game-img");

    // query for game deals on click
    anchorWrap.addEventListener('click', e => {
      getGameInfo(gameObj.gameID)
        .then(gameData => {
          console.log("This is gameData " + gameData);
          const testDiv = document.createElement('div');
          testDiv.textContent = JSON.stringify(gameData);
          testDiv.style.color = "white";
          body.appendChild(testDiv);
        })
    }); 

    // set image as background
    if (gameObj.thumb !== "") {
      imgDiv.style.backgroundImage = `url(${gameObj.thumb})`;
    }

    // add game title and price elements
    const [gameTitle, gamePrice] = 
    [
      document.createElement("h2"),
      document.createElement("div")
    ];
    gameTitle.classList.add("game-list-title");
    gameTitle.textContent = gameObj.external;
    gamePrice.classList.add("game-list-price");
    gamePrice.textContent = "Cheapest: $" + gameObj.cheapest;

    gameDiv.appendChild(gameTitle);
    gameDiv.appendChild(gamePrice);

    // place elements within each other and
    // place the game within the grid
    anchorWrap.appendChild(imgDiv);
    anchorWrap.appendChild(gameDiv);
    listContainer.appendChild(anchorWrap);
  })
  body.appendChild(listContainer);
}