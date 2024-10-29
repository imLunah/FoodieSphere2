// src/RecipeDetail.js

import { useLoaderData, Link } from "react-router-dom";

const RecipeDetail = () => {
  const recipe = useLoaderData();

  const instructionsList = recipe.instructions.split("\n");

  return (
    <div>
      <h1>{recipe.title}</h1>
      <img src={recipe.image} alt={recipe.title} />
      <p>Ready in {recipe.readyInMinutes} minutes</p>
      <p>Cost: ${(recipe.pricePerServing / 10).toFixed(2)}</p>
      <p>Servings: {recipe.servings}</p>
      {recipe.cuisines && recipe.cuisines.length > 0 && (
        <p>Cuisine: {recipe.cuisines.join(", ")}</p>
      )}

      <ul className="recipe-list">
        {instructionsList.map((instructions, index) => (
          <li key={index}> {`Step ${index + 1}: ${instructions}`} </li>
        ))}
      </ul>

      <Link to="/search"> Back To Search </Link>
    </div>
  );
};

export default RecipeDetail;
