import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import Home from "./routes/home";
import Root from "./routes/root";
import Signin from "./routes/signin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
    ],
  },
  {
    path: "/signin",
    element: <Signin />,
  },
]);

const App = () => {
  return (
    <div className="dark">
      <div className="dark:text-gray-200 dark:bg-gray-800">
        <RouterProvider router={router} />
      </div>
    </div>
  );
};

export default App;
