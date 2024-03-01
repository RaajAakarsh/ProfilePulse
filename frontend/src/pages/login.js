import React, { useState } from "react";
import "../styles/login.css";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";

const Login = (props) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rDirect, setRDirect] = useState(false);
	const [userMessage, setUserMessage] = useState("");
	const { setName } = props;

	const Submit = async (e) => {
		e.preventDefault();

		const response = await fetch("http://localhost:8000/api/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ email, password }),
		});
		try {
			if (response.ok) {
				const content = await response.json();
				setName(content.name);
				console.log("You are authenticated successfully!!!");
				setRDirect(true);
			} else {
				const errorResponse = await response.json();
				console.log("Error:", errorResponse);
				setUserMessage(errorResponse.detail);
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	if (rDirect) {
		return <Navigate to="/" />;
	}

	return (
		<div className="login-container">
			<div className="login-form">
				<div className="login-form-heading heading-font">LOGIN</div>
				<div className="login-form-start">
					<form onSubmit={Submit}>
						<label>Email</label>
						<input
							type="email"
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<label>Password</label>
						<input
							type="password"
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<input type="submit" />
						<p>
							Haven't registered? <Link to={"/register"}>Sign up</Link>
						</p>
						{userMessage !== "" && (
							<p className="user-message">{userMessage}</p>
						)}
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
