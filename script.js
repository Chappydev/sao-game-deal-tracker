const body = document.querySelector("body");
const dealsContainer = document.querySelector('#deals-container');
const gameDetails = document.querySelector('#game-details');
const dealsList = document.querySelector('#deals-list');

let storeListData = [];

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
    const gameInfoResp = await fetch(
      `https://www.cheapshark.com/api/1.0/games?id=${id}`,
      gameInfoOptions
    );

    if (gameInfoResp.ok === -1) {
      throw new Error(`HTTP error: ${gameInfoResp.status}`);
    }

    // Extracting data from response object as JSON
    const gameInfo = gameInfoResp.json();
    return gameInfo;
  } catch (err) {
    console.error(err);
  }
}

async function getStoresInfo() {
  try {
    // setting options for the request
    const storesInfoOptions = {
      method: 'GET',
      redirect: 'follow'
    }; 

    // making request and saving the response in response object
    const response = await fetch(
      `https://www.cheapshark.com/api/1.0/stores`,
      storesInfoOptions
    );

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    // Extracting data from response object as JSON
    const storesData = await response.json();
    return storesData;
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', e => {
  // in
  let gameList = [];

  getStoresInfo()
    .then(storesData => {
      storeListData = storesData;
      console.log(`This is storeListData: ${storeListData}`);
    })

  getGameList()
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
          console.log(gameData);
          // Game info (left side)
          const titleHeader = document.querySelector("#game-title");
          const coverImage = document.querySelector("#game-img");
          const allTimeCheapest = document.querySelector("#game-cheapest");

          titleHeader.textContent = gameData.info.title;
          coverImage.setAttribute("src", gameData.info.thumb);
          coverImage.setAttribute("alt", `Cover image for ${gameData.info.title}`);
          allTimeCheapest.textContent = `All time best deal: $${gameData.cheapestPriceEver.price}`;
          
          // Deals info (right side)
          const dealsList = document.querySelector("#deals-list");
          gameData.deals.forEach(deal => {
            const dealDiv = document.createElement("div");
            dealDiv.classList.add("deal");
            const dealPrice = document.createElement("div");
            dealPrice.classList.add("deal-price");
            const retailPrice = document.createElement("span");
            retailPrice.classList.add("retail-price");
            const savings = document.createElement("div");
            savings.classList.add("deal-savings");
            const storeImg = document.createElement("img");
            storeImg.classList.add("deal-store-img");
            const storeName = document.createElement("h3");
            storeName.classList.add("store-name");

            dealPrice.textContent = deal.price;
            retailPrice.textContent = deal.retailPrice;
            savings.textContent = "%" + Math.round(Number(deal.savings)).toString();
            storeName.textContent = storeListData[parseInt(deal.storeID) - 1].storeName;

            dealDiv.appendChild(storeName);
            dealDiv.appendChild(storeImg);
            // use the span to cross out the old price
            dealPrice.appendChild(retailPrice);
            dealDiv.appendChild(dealPrice);
            dealDiv.appendChild(savings);
            console.log(dealDiv);
            dealsList.appendChild(dealDiv);
          })
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