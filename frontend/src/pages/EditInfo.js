import React from "react";
import "../styles/EditInfo.css";

const EditInfo = () => {
	return (
		<div className="login-container">
			<div className="login-form">
				<div className="login-form-heading heading-font">EDIT PROFILE</div>
				<div className="login-form-start">
					<form>
						<label>Username</label>
						<input type="text" required />
						<label>Email</label>
						<input type="email" required />

						<input type="submit" />
					</form>
				</div>
			</div>
		</div>
	);
};

export default EditInfo;
