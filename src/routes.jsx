// src/routes.jsx
import { createBrowserRouter } from "react-router-dom";
import Home from "./Home.jsx"; // Import Home here
import Food from "./Food.jsx";
import RecipeDetail from "./RecipeDetail.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />, // Use Home as the default element
  },
  {
    path: "/search/:cuisine?", // Updated path to include optional cuisine parameter
    element: <Food />,
  },
  {
    path: "/recipe/:id",
    element: <RecipeDetail />,
    loader: async ({ params }) => {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${params.id}/information?apiKey=${import.meta.env.VITE_API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch recipe");
      }
      return response.json();
    },
    errorElement: <p>Recipe not found!</p>,
  },
]);

export default router;
