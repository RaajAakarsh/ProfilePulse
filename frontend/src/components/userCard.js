import React from "react";
import "../styles/userCard.css";
import sampleProfilePic from "../assets/sample_profile_pic.avif";

const UserCard = (props) => {
	const {name} = props;
	const {index} = props;
	return (
		<div className="user-card-container-outer">
			<div className="user-card-container">
				<div className="user-card-image">
					<img src={sampleProfilePic} alt="User Profile Pic" />
				</div>
				<div className="user-card-name heading-font">{index}.&nbsp;&nbsp;&nbsp;&nbsp;{name}</div>
			</div>
		</div>
	);
};

export default UserCard;
