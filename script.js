const body = document.querySelector("body");
let gameList = [];
let filteredListData = [];


async function getGameList() {
  try {
    // setting options for the request
    const testReqOptions = {
      method: 'GET',
      redirect: 'follow'
    }; 

    // making request and saving the response in the response object
    const response = await fetch(
      'https://www.cheapshark.com/api/1.0/games?title=swordartonline&exact=0',
      testReqOptions
    ); 

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    // Extracting data from response object as JSON
    const data = await response.json(); 
    return data;
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', e => {
  getGameList() // let's do this and the filtering on page load
    .then(data => {
      gameList = data;
      console.log("This is gameList: " + gameList);
      const filteredListData = data
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

function createSearchOptions(data) {
  const searchContainer = document.createElement("div");
  searchContainer.classList.add("container");
  searchContainer.style.display = "flex";
  searchContainer.style.flexDirection = "column";
  const [innerDiv0, innerDiv1, innerDiv2] = 
    [
      document.createElement("div"), 
      document.createElement("div"), 
      document.createElement("div")
    ];
  const innerDivs = [innerDiv0, innerDiv1, innerDiv2];
  innerDivs.forEach((div, ind) => {
    div.classList.add("inner-search");
    div.style.display = "flex";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";
    const [innerImg, innerTitle, innerCheapest] = [
      document.createElement("img"),
      document.createElement("div"),
      document.createElement("div")
    ];
    innerImg.style.maxHeight = "50px";
    innerImg.style.width = "auto";
    innerImg.setAttribute("src", `${data[ind].thumb}`);

    innerTitle.textContent = data[ind].title;
    
    innerCheapest.textContent = data[ind].cheapest;

    div.appendChild(innerImg);
    div.appendChild(innerTitle);
    div.appendChild(innerCheapest);
  });
  searchContainer.appendChild(innerDiv0);
  searchContainer.appendChild(innerDiv1);
  searchContainer.appendChild(innerDiv2);
  console.log(searchContainer);
  body.appendChild(searchContainer);
}

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