import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import StoryPage from "./StoryPage";
import ProtectedRoute from "./ProtectedRoute";
import RegistrationPage from "./RegistrationPage";
import { useAuthContext } from "contexts/AuthorizationProvider";
import StoriesListPage from "./StoriesListPage";

const PATHS = {
  login: "/login",
  register: "/register",
  stories: "/stories",
  createStory: "/stories/:storyId",
};

const Router = () => {
  const {
    state: { user },
  } = useAuthContext();
  const location = useLocation();
  if (
    !!user.id &&
    (location.pathname === "/login" || location.pathname === "/register")
  ) {
    return (
      <Navigate to="/stories" replace state={{ path: location.pathname }} />
    );
  }

  return (
    <Routes>
      <Route
        path={PATHS.stories}
        element={
          <ProtectedRoute>
            <StoriesListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.createStory}
        element={
          <ProtectedRoute>
            <StoryPage />
          </ProtectedRoute>
        }
      />
      <Route path={PATHS.login} element={<LoginPage />} />
      <Route path={PATHS.register} element={<RegistrationPage />} />
    </Routes>
  );
};
export default Router;
