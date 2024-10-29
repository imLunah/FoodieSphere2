// src/Food.jsx

import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom"; // Import useParams
import axios from "axios";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const Food = () => {
  const { cuisine } = useParams(); // Get the cuisine from the URL parameters
  const [food, setFood] = useState([]);
  const [searchRecipe, setSearchRecipe] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState(cuisine || ""); // Set initial state from URL
  const [excludeRecipe, setExcludeRecipe] = useState([]);
  const [cuisineCounts, setCuisineCounts] = useState({});

  const cuisines = [
    "African",
    "Asian",
    "American",
    "British",
    "Cajun",
    "Caribbean",
    "Chinese",
    "Eastern European",
    "European",
    "French",
    "German",
    "Greek",
    "Indian",
    "Irish",
    "Italian",
    "Japanese",
    "Jewish",
    "Korean",
    "Latin American",
    "Mediterranean",
    "Mexican",
    "Middle Eastern",
    "Nordic",
    "Southern",
    "Spanish",
    "Thai",
    "Vietnamese",
  ];

  // Fetch multiple random recipes on component mount
  useEffect(() => {
    const discoverRecipes = async () => {
      try {
        const response = await axios.get(
          "https://api.spoonacular.com/recipes/random",
          {
            params: {
              apiKey: import.meta.env.VITE_API_KEY,
              number: 2, // Fetch multiple random recipes
            },
          }
        );
        setFood(response.data.recipes);
        updateCuisineCounts(response.data.recipes);
      } catch (err) {
        console.error(err);
      }
    };
    discoverRecipes();
  }, []);

  const handleCuisine = (cuisine) => {
    setSelectedCuisine(cuisine);
  };

  const searchForRecipes = async () => {
    if (!searchRecipe) {
      return;
    }

    try {
      const response = await axios.get(
        "https://api.spoonacular.com/recipes/complexSearch",
        {
          params: {
            apiKey: import.meta.env.VITE_API_KEY,
            query: searchRecipe,
            cuisine: selectedCuisine,
            number: 2, // Fetch multiple recipes
            addRecipeInformation: true,
          },
        }
      );
      setFood(response.data.results);
      updateCuisineCounts(response.data.results);
    } catch (err) {
      console.error(err);
    }
  };

  const updateCuisineCounts = (recipes) => {
    const counts = {};
    recipes.forEach((recipe) => {
      const cuisinesArray = recipe.cuisines; // Adjust this based on your data structure
      cuisinesArray.forEach((cuisine) => {
        counts[cuisine] = counts[cuisine] ? counts[cuisine] + 1 : 1;
      });
    });
    setCuisineCounts(counts);
  };

  const exclude = (title) => {
    if (!excludeRecipe.includes(title)) {
      setExcludeRecipe([...excludeRecipe, title]);
    }
  };

  const filteredFood = food
    .filter((recipe) => {
      // If selectedCuisine is set, filter by cuisine
      if (selectedCuisine) {
        return recipe.cuisines && recipe.cuisines.includes(selectedCuisine);
      }
      return true; // If no cuisine is selected, return all recipes
    })
    .filter((recipe) => !excludeRecipe.includes(recipe.title));

  const chartData = Object.entries(cuisineCounts).map(([key, value]) => ({
    name: key,
    value,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div>
      <input
        type="text"
        value={searchRecipe}
        onChange={(e) => setSearchRecipe(e.target.value)}
      />
      <button onClick={searchForRecipes}> Search </button>

      <div className="PieChart">
        {chartData.length > 0 ? (
          <PieChart width={400} height={400}>
            <Pie
              data={chartData}
              cx={200}
              cy={200}
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              isAnimationActive={true}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        ) : (
          <p>No data to display</p>
        )}
      </div>

      <div className="filter-list">
        <h3> or search selected cuisines! </h3>
        <div className="filter">
          {cuisines.map((cuisineOption, index) => (
            <Link key={index} to={`/search/${cuisineOption}`}>
              <button onClick={() => handleCuisine(cuisineOption)}>
                {cuisineOption}
              </button>
            </Link>
          ))}
        </div>
      </div>

      <div className="food-list">
        <ul className="food">
          {filteredFood.map((recipe, index) => (
            <li key={index}>
              <Link to={`/recipe/${recipe.id}`}>
                <h2>{recipe.title}</h2>
                <img src={recipe.image} alt={recipe.title} />
                <p>Ready in {recipe.readyInMinutes} minutes</p>
                <p>Cost: ${(recipe.pricePerServing / 10).toFixed(2)}</p>
                <p>Servings: {recipe.servings}</p>
                {recipe.cuisines && recipe.cuisines.length > 0 && (
                  <p>Cuisine: {recipe.cuisines.join(", ")}</p>
                )}
              </Link>
              <button onClick={() => exclude(recipe.title)}>Exclude</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Food;
