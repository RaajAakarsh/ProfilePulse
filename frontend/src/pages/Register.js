import React, { useState } from "react";
import "../styles/register.css";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";

const Register = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rDirect, setRDirect] = useState(false);

	const [rPassword, setRPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState(false);
	const [errorResponse, setErrorResponse] = useState("");

	const submit = async (e) => {
		e.preventDefault();

		if (!name.trim()) {
			setErrorResponse("Please provide a valid name");
			return;
		}

		if (password !== rPassword) {
			setErrorMessage(true);
		} else {
			const response = await fetch("http://localhost:8000/api/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password }),
			});

			try {
				if (response.ok) {
					console.log("You are registered successfully!!!");
					setRDirect(true);
				} else {
					const errorResponse = await response.json();
					console.log("Error:", errorResponse);
					setErrorResponse(errorResponse);
				}
			} catch (error) {
				console.error("Error:", error);
			}
		}
	};

	if (rDirect) {
		return <Navigate to="/login" />;
	}

	return (
		<div className="register-container">
			<div className="register-form">
				<div className="register-form-heading heading-font">REGISTER</div>
				<div className="register-form-start">
					<form onSubmit={submit}>
						<label>Name</label>
						<input
							type="text"
							onChange={(e) => setName(e.target.value)}
							required
						/>
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
						<label>Retype the Password</label>
						<input
							type="password"
							onChange={(e) => setRPassword(e.target.value)}
							required
						/>
						<input type="submit" />
						<p>
							Already registered? <Link to={"/login"}>Sign in</Link>
						</p>
						<div style={{ color: "red", fontWeight: "900" }}>
							{errorMessage ? "The Passwords Do not match!!!" : ""}
						</div>
						<div style={{ color: "red", fontWeight: "900" }}>
							{errorResponse !== "" ? errorResponse : ""}
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Register;
