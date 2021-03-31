import express from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import hbs from "hbs";
import geocode from "./utils/geocode.mjs";
import weather from "./utils/weather.mjs";

const app = express();
const port = process.PORT || 3000;

const __dirname = dirname(fileURLToPath(import.meta.url));

// Define paths for Express config
const publicPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicPath));

const now = new Date();
const year = now.getFullYear();

const data = {
  title: "Weather App",
  name: "Ville Vettenranta",
  age: "42",
  aboutText:
    "On this page there are text about the page and it's creator, and also some documentation",
  currentYear: year,
  notFound: "This is not the page you're looking for",
  subtitle: "Main page",
  currentPage: "main",
};
app.get("", (req, res) => {
  res.render("index", data);
});

app.get("/about", (req, res) => {
  let customData = { ...data };
  customData.subtitle = "About";
  customData.currentPage = "about";
  res.render("about", customData);
});

app.get("/help", (req, res) => {
  let customData = { ...data };
  customData.subtitle = "Help";
  customData.currentPage = "help";
  res.render("help", customData);
});

app.get("/help/*", (req, res) => {
  let customData = { ...data };
  customData.notFound = "This is not the help article you're looking for";
  customData.currentPage = "404";
  res.render("404", customData);
});

app.get("/weather", (req, res) => {
  if (!req.query.city) {
    return res.send({
      error: "Query param 'city' must be provided",
    });
  }
  const { city } = req.query;
  console.log(city);

  geocode(city, (error, { lat, long, city } = {}) => {
    if (error) {
      return res.send({
        error: error.message,
      });
    }

    weather(
      lat,
      long,
      city,
      (err, { city, description, feelslike, temperature }) => {
        if (err) {
          return res.send({ error: err.message });
        }
        return res.send({
          forecast: {
            city,
            description,
            feelslike,
            temperature,
          },
        });
      }
    );
  });
});

app.get("*", (req, res) => {
  let customData = { ...data };
  customData.subtitle = "The 404 -page";
  customData.currentPage = "404";
  res.render("404", data);
});

app.listen(port, () => {
  console.log(`The weather app is running on port ${port}`);
});
