import React, { useState } from "react";
import "../styles/EditInfo.css";
import { Navigate } from "react-router-dom";

const EditInfo = (props) => {
	const { setName } = props;
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");

	const [rDirect, setRDirect] = useState(false);
	const [userMessage, setUserMessage] = useState("");

	const Submit = async (e) => {
		e.preventDefault();

		if (!username.trim()) {
			setUserMessage("Please provide a valid name");
			return;
		}

		if (!email.trim()) {
			setEmail("Please provide a valid name");
			return;
		}

		const response = await fetch("http://localhost:8000/api/editProfile", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ username, email }),
		});
		try {
			if (response.ok) {
				const content = await response.json();
				setName(content.name);
				console.log("Your Profile has successfully been updated!!!");
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

	let edit_page;
	if (props.name === "") {
		<div className="login-form"></div>;
	} else {
		edit_page = (
			<div className="login-form">
				<div className="login-form-heading heading-font">EDIT PROFILE</div>
				<div className="login-form-start">
					<form onSubmit={Submit}>
						<label>Username</label>
						<input
							type="text"
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
						<label>Email</label>
						<input
							type="email"
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<input type="submit" />
					</form>
					{userMessage !== "" && <p className="user-message">{userMessage}</p>}
				</div>
			</div>
		);
	}

	if (rDirect) {
		return <Navigate to="/" />;
	}

	return (
		<>
			<div className="login-container">{edit_page}</div>
			<div></div>
		</>
	);
};

export default EditInfo;
