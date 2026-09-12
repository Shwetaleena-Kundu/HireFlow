import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "../auth.css";

function Login({ setUserSession }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previousData) => ({ ...previousData, [name]: value }));
    setError("");
  };

  const handleLogin = (event) => {
    event.preventDefault();

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem("hireflowUser"));

    if (!savedUser) {
      setError("No HireFlow account found. Please create an account first.");
      return;
    }

    if (savedUser.email.toLowerCase() !== email || savedUser.password !== password) {
      setError("Incorrect email or password.");
      return;
    }

    const session = {
      name: savedUser.name,
      email: savedUser.email,
      loggedIn: true,
      rememberMe,
    };

    localStorage.setItem("hireflowSession", JSON.stringify(session));
    setUserSession(session);
    navigate("/");
  };

  return (
    <main className="auth-page login-page">
      <section className="auth-container">
        <div className="auth-brand-side">
          <div className="auth-logo">
            <h1>HireFlow</h1>
            <p>Track. Apply. Grow.</p>
          </div>

          <div className="auth-brand-content">
            <span className="auth-small-label">WELCOME BACK</span>
            <h2>Your next<br />opportunity awaits.</h2>
            <p>
              Pick up where you left off, manage your applications and stay
              focused on your next career move.
            </p>
            <div className="auth-feature-list">
              <span>✓ Track every opportunity</span>
              <span>✓ Stay interview ready</span>
              <span>✓ Follow your progress</span>
            </div>
          </div>
        </div>

        <div className="auth-form-side">
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-form-heading">
              <span>CONTINUE YOUR JOURNEY</span>
              <h2>Welcome back 👋</h2>
              <p>Log in to continue your HireFlow journey.</p>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <div className="auth-field">
              <label htmlFor="loginEmail">Email Address</label>
              <input
                id="loginEmail"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="loginPassword">Password</label>
              <div className="auth-password-field">
                <input
                  id="loginPassword"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label="Show or hide password"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="auth-options">
              <label className="auth-remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                Remember me
              </label>

              <button
                type="button"
                className="auth-forgot-password"
                onClick={() => setError("Password reset will be available in a future version.")}
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" className="auth-submit-btn">Log In →</button>

            <p className="auth-switch">
              Don't have an account? <Link to="/register">Create account</Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Login;
