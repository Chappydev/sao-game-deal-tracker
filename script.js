const body = document.querySelector("body");
const testDiv = document.querySelector("#test");
testDiv.textContent = "Test";



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

const reqButton = document.createElement("button");
reqButton.textContent = "Get Data";
reqButton.addEventListener('click', e => {
  getGameList()
    .then(data => {
      console.log(data);
      const filteredData = data
        .slice(0, 3)
        .map(({ thumb, external, cheapest }) => {
          return {
            thumb: thumb,
            title: external,
            cheapest: cheapest
          };
      });
      
      console.log(filteredData);

      createSearchOptions(filteredData);
    })
});
body.appendChild(reqButton);

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
