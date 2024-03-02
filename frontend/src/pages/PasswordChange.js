import React, { useState } from "react";
import "../styles/password_change.css";
import { Navigate } from "react-router-dom";

const PasswordChange = (props) => {
	const { setName } = props;
	const [currPassword, setCurrPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [retypeNewPassword, setRetypeNewPassword] = useState("");

	const [rDirect, setRDirect] = useState(false);
	const [userMessage, setUserMessage] = useState("");
	const [errorBool, setErrorBool] = useState(false);

	const Submit = async (e) => {
		e.preventDefault();

		if (!currPassword.trim()) {
			setUserMessage("Please provide a valid password");
			return;
		}

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
		} else {
			const response = await fetch("http://localhost:8000/api/passwordReset", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ currPassword, newPassword }),
			});
			try {
				if (response.ok) {
					const content = await response.json();
					setName(content.name);
					console.log("Your Password has successfully been reset!!!");
					setRDirect(true);
				} else {
					const errorResponse = await response.json();
					console.log("Error:", errorResponse);
					setUserMessage(errorResponse);
				}
			} catch (error) {
				console.error("Error:", error);
			}
		}
	};

	let password_change_page;
	if (props.name === "") {
		<div className="password-change-form"></div>;
	} else {
		password_change_page = (
			<div className="password-change-form">
				<div className="password-change-form-heading heading-font">
					RESET PASSWORD
				</div>
				<div className="password-change-form-start">
					<form onSubmit={Submit}>
						<label>Type your current password :</label>
						<input
							type="password"
							onChange={(e) => setCurrPassword(e.target.value)}
							required
						/>
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
					{userMessage !== "" && <p className="user-message">{userMessage}</p>}
					{errorBool && <p className="user-message">Error - The passwords do not match</p>}
				</div>
			</div>
		);
	}

	if (rDirect) {
		return <Navigate to="/login" />;
	}

	return (
		<>
			<div className="password-change-container">{password_change_page}</div>
			<div></div>
		</>
	);
};

export default PasswordChange;
