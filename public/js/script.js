console.log("Client side JS has been loaded!");

let currentPage = document.location.pathname;
console.log(currentPage);
let navElements = document.querySelectorAll(".navelement");
for (let element of navElements) {
  if (!currentPage.includes(element.id)) {
    element.classList.add("not-current-page");
  }
  if (currentPage === "/" && element.id === "forecast") {
    element.classList.remove("not-current-page");
    weatherFetcher();
  }
}

function weatherFetcher() {
  const formElement = document.querySelector("#weatherForm");
  const inputP = document.querySelector("#weatherResult");

  formElement.addEventListener("submit", function (event) {
    event.preventDefault();
    const inputs = this.elements;
    const city = inputs["city"];
    city.addEventListener("click", (event) => {
      event.preventDefault();
    });
    const cityValue = city.value;

    if (!cityValue) {
      return console.log("I ain't doin' nothing");
    }

    fetch(`http://localhost:3000/weather?city=${encodeURIComponent(cityValue)}`)
      .then((response) => {
        response
          .json()
          .then((data) => {
            const { error, forecast } = data;
            console.log(error ? error : data);
            const resultString = error
              ? error
              : `Current weather in ${forecast.city}: ${forecast.description}. Temperature ${forecast.temperature} C°. Feelslike ${forecast.feelslike} C°.`;

            inputP.innerHTML = resultString || "Fetching weather data...";
          })
          .catch((er) => {
            return er;
          });
      })
      .catch((er) => {
        inputP.innerHTML = er.message ? er.message : error;
      });
  });
}
