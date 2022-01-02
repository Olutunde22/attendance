import React, { Suspense } from "react";
import { Login, Signup, Home, Lecturer } from "./routes";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <Router>
      <Suspense
        fallback={
          <div className="flex items-center flex-col min-h-screen justify-center">
            {" "}
            <svg
              style={{ borderTopColor: "transparent" }}
              className="animate-spin h-20 w-20 rounded-full border-blue-500 border-4 border-solid"
              viewBox="0 0 24 24"
            ></svg>
            <span className="text-gray-500 text-2xl mt-4">Loading...</span>
          </div>
        }
      >
        <Switch>
          <Route path="/login" exact={true} component={Login} />
          <Route path="/signup" exact={true} component={Signup} />
          <Route path="/lecturer" exact={true} component={Lecturer} />
					<Route path="/" component={Home} />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
