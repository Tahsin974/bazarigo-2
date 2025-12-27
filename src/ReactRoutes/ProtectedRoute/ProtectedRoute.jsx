import { Navigate } from "react-router";
import useAuth from "../../Utils/Hooks/useAuth";
import Loading from "../../components/Loading/Loading";
import { useLocation } from "react-router";

export default function ProtectedRoute({ children, allowRoles }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (!isLoading) {
    if (!user)
      return (
        <Navigate
          to="/sign-up"
          state={{ pathName: location.pathname }}
          replace
        />
      );
    if (allowRoles && !allowRoles.includes(user.role)) {
      return <Navigate to="/not-found" replace />;
    }

    return children;
  } else {
    return <Loading />;
  }
}
