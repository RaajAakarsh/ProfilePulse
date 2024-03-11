import React, { useState } from "react";
import "../styles/password_change.css";
import { Navigate } from "react-router-dom";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");

	const [rDirect, setRDirect] = useState(false);
	const [userMessage, setUserMessage] = useState("");
	const [errorBool, setErrorBool] = useState(false);

	const Submit = async (e) => {
		e.preventDefault();

		if (!email.trim()) {
			setUserMessage("Please provide a valid password");
			return;
		}
		// if (newPassword !== retypeNewPassword) {
		// 	setErrorBool(true);
		// } else {
		const frontendDomain = window.location.origin;

		const response = await fetch("http://localhost:8000/api/forgotPassword", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, frontendDomain }),
		});
		try {
			if (response.ok) {
				const content = await response.json();
				console.log("Check your email for password reset link");
				setRDirect(true);
			} else {
				const errorResponse = await response.json();
				console.log("Error:", errorResponse);
				setUserMessage(errorResponse);
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	if (rDirect) {
		return <Navigate to="/login" />;
	}

	return (
		<>
			<div className="password-change-container">
				<div className="password-change-form">
					<div className="password-change-form-heading heading-font">
						RESET PASSWORD
					</div>
					<div className="password-change-form-start">
						<form onSubmit={Submit}>
							<label>Email associated to your account:</label>
							<input
								type="email"
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
							<input type="submit" />
						</form>
						{userMessage !== "" && (
							<p className="user-message">{userMessage}</p>
						)}
					</div>
				</div>
			</div>
			<div></div>
		</>
	);
};

export default ForgotPassword;
