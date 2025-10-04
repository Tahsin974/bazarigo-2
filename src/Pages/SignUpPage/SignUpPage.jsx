import { useState } from "react";
import AuthPanel from "./components/AuthPanel";
import PasswordResetPanel from "./components/PasswordResetPanel";
import SetNewPasswordPanel from "./components/SetNewPasswordPanel";
import ErrorPanel from "./components/ErrorPanel";

export default function SignUpPage() {
  const [screen, setScreen] = useState("login");

  const renderScreen = () => {
    switch (screen) {
      case "login":
        return <AuthPanel type="login" onNavigate={setScreen} />;
      case "signup":
        return <AuthPanel type="signup" onNavigate={setScreen} />;
      case "reset":
        return <PasswordResetPanel onNavigate={setScreen} />;
      case "new-password":
        return <SetNewPasswordPanel onNavigate={setScreen} />;
      case "error":
        return (
          <ErrorPanel
            message="Invalid or expired reset link."
            onNavigate={setScreen}
          />
        );
      default:
        return (
          <ErrorPanel message="404 - Page not found." onNavigate={setScreen} />
        );
    }
  };

  return <>{renderScreen()}</>;
}
