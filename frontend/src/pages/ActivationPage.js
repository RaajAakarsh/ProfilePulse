import React, { useState, useEffect } from "react";
import "../styles/ActivationPage.css";
import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const ActivationPage = () => {
	const { uidb64, token } = useParams();
	const [rDirect, setRDirect] = useState(false);

	useEffect(() => {
		const activateUser = async (uidb64, token) => {
			try {
				const response = await fetch(
					`http://localhost:8000/api/activate_user/${uidb64}/${token}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				if (response.ok) {
					console.log("Your email has successfully been verified!!!");
					const Response = await response.json();
					console.log("Message:", Response);
					setRDirect(true);
				} else {
					const errorResponse = await response.json();
					console.log("Error:", errorResponse.detail);
				}
			} catch (error) {
				console.log("Error activating user");
			}
		};
		activateUser(uidb64, token);
	}, [uidb64, token]);

	if (rDirect) {
		return <Navigate to="/login" />;
	}

	return (
		<div className="activation-container">
			<div className="activation">
				<p>Please wait...</p>
			</div>
		</div>
	);
};

export default ActivationPage;
