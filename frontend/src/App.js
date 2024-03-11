import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ActivationPage from "./pages/ActivationPage";
import PasswordChange from "./pages/PasswordChange";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UsersPage from "./pages/UsersPage";
import Register from "./pages/Register";
import EditInfo from "./pages/EditInfo";
import Navbar from "./components/nav";
import Login from "./pages/login";
import Home from "./pages/Home";
import "./styles/App.css";

function App() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("http://localhost:8000/api/user", {
					headers: { "Content-Type": "application/json" },
					credentials: "include",
				});

				if (response.ok) {
					const content = await response.json();
					setName(content.name);
					setEmail(content.email);
				}
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};

		fetchData();
	}, [name]);

	return (
		<div className="App">
			<Router>
				<Navbar name={name} setName={setName} />
				<main className="form-signin">
					<Routes>
						<Route
							exact
							path="/"
							element={<Home name={name} email={email} />}
						/>
						<Route exact path="/login" element={<Login setName={setName} />} />
						<Route exact path="/register" element={<Register />} />
						<Route exact path="/users" element={<UsersPage />} />
						<Route
							path="/activate_user/:uidb64/:token"
							element={<ActivationPage />}
						/>
						<Route
							path="/reset_forgot_password/:uidb64/:token"
							element={<ResetPassword />}
						/>
						<Route
							exact
							path="/edit-profile"
							element={<EditInfo name={name} setName={setName} />}
						/>
						<Route
							exact
							path="/password-change"
							element={<PasswordChange name={name} setName={setName} />}
						/>
						<Route
							exact
							path="/forgot-password"
							element={<ForgotPassword />}
						/>
					</Routes>
				</main>
			</Router>
		</div>
	);
}

export default App;
