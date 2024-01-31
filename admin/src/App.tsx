import "./App.scss";
import { RouterProvider } from "react-router-dom";
import router from "./Router";
import { Provider } from "react-redux";
import { store } from "./store/store";

function App() {
  console.log(document.cookie);
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
