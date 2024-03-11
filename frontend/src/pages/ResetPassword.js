import React, { useState, useEffect } from "react";
import "../styles/ActivationPage.css";
import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
	const { uidb64, token } = useParams();
	const [rDirect, setRDirect] = useState(false);

	const [userMessage, setUserMessage] = useState("");
	const [errorBool, setErrorBool] = useState(false);

	const [newPassword, setNewPassword] = useState("");
	const [retypeNewPassword, setRetypeNewPassword] = useState("");

	const SubmitReset = async (e) => {
		e.preventDefault();
        console.log(uidb64, token);
		if (!newPassword.trim()) {
			setUserMessage("Please provide a valid password");
			return;
		}
		if (!retypeNewPassword.trim()) {
			setUserMessage("Please provide a valid password");
			return;
		}
		if (newPassword !== retypeNewPassword) {
			setErrorBool(true);
			console.log("1");
		} else {
			const response = await fetch(
				`http://localhost:8000/api/reset_forgot_password/${uidb64}/${token}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ newPassword }),
				}
			);
			try {
				if (response.ok) {
					console.log("Your password has successfully been reset!!");
					const Response = await response.json();
					console.log("Message:", Response);
					setRDirect(true);
				} else {
					const errorResponse = await response.json();
					console.log("Error:", errorResponse.detail);
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
		<>
			<div className="password-change-container">
				<div className="password-change-form">
					<div className="password-change-form-heading heading-font">
						RESET PASSWORD
					</div>
					<div className="password-change-form-start">
						<form onSubmit={SubmitReset}>
							<label>Set new password :</label>
							<input
								type="password"
								onChange={(e) => setNewPassword(e.target.value)}
								required
							/>
							<label>Retype new password :</label>
							<input
								type="password"
								onChange={(e) => setRetypeNewPassword(e.target.value)}
								required
							/>
							<input type="submit" />
						</form>
						{userMessage !== "" && (
							<p className="user-message">{userMessage}</p>
						)}
						{errorBool && (
							<p className="user-message">Error - The passwords do not match</p>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default ResetPassword;
