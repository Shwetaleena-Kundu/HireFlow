import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import "../auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  };

  const handleRegister = (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();

    if (
      !name ||
      !email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const existingUser = JSON.parse(
      localStorage.getItem("hireflowUser")
    );

    if (existingUser?.email?.toLowerCase() === email) {
      setError("An account with this email already exists.");
      return;
    }

    const newUser = {
      name,
      email,
      password: formData.password,
    };

    localStorage.setItem(
      "hireflowUser",
      JSON.stringify(newUser)
    );

    navigate("/login");
  };

  return (
    <main className="auth-page register-page">
      <section className="auth-container">
        <div className="auth-brand-side">
          <div className="auth-logo">
            <h1>HireFlow</h1>
            <p>Track. Apply. Grow.</p>
          </div>

          <div className="auth-brand-content">
            <span className="auth-small-label">
              YOUR CAREER, ORGANIZED
            </span>

            <h2>
              Turn applications
              <br />
              into opportunities.
            </h2>

            <p>
              Keep your job search organized, track every
              opportunity and prepare confidently for what
              comes next.
            </p>

            <div className="auth-feature-list">
              <span>✓ Track applications</span>
              <span>✓ Prepare for interviews</span>
              <span>✓ Understand your progress</span>
            </div>
          </div>
        </div>

        <div className="auth-form-side">
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="auth-form-heading">
              <span>START YOUR JOURNEY</span>
              <h2>Create your account</h2>
              <p>
                Start organizing your job search with HireFlow.
              </p>
            </div>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="registerName">
                Full Name
              </label>

              <input
                id="registerName"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="registerEmail">
                Email Address
              </label>

              <input
                id="registerEmail"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="registerPassword">
                Password
              </label>

              <div className="auth-password-field">
                <input
                  id="registerPassword"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Enter password again"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
            >
              Create Account →
            </button>

            <p className="auth-switch">
              Already have an account?{" "}
              <Link to="/login">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Register;
