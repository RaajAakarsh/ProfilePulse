import React from "react";
import "../styles/user-dashboard.css";
import sampleProfilePic from "../assets/sample_profile_pic.avif";
import icon_editing from "../assets/editing.png";
import { Link } from "react-router-dom";

const UserDashboard = (props) => {
	const { name } = props;
	const { email } = props;
	return (
		<div className="user-dashboard">
			{props.name ? (
				<div className="user-dashboard-inner">
					<div className="user-image">
						<img src={sampleProfilePic} alt="User Profile Pic" />
					</div>
					<div className="user-details">
						<div className="user-name-section">
							<div className="user-name heading-font">{name}</div>
							<div className="user-profile-edit-icon">
								<Link to="/edit-profile">
									<img src={icon_editing} alt="" />
								</Link>
							</div>
						</div>
						<div className="user-email">{email}</div>
						<div className="user-bio">
							Lorem, ipsum dolor sit amet consectetur adipisicing elit.
							Consequuntur sed, in blanditiis nobis dolores quia totam nisi
							dolore molestiae ea minima debitis ratione nulla, architecto,
							fugit iure corporis ipsam atque molestias voluptate. Perspiciatis
							perferendis iure veniam, impedit officiis aperiam deserunt at
							nihil, et modi nulla doloribus dolores blanditiis. Magni, libero?
						</div>
						<div className="user-profile-changes">
							<div className="user-password-change">
								<Link to="/password-change">
									<button>
										Password&nbsp;
										<img src={icon_editing} alt="" />
									</button>
								</Link>
							</div>
							{/* <div className="user-delete-profile">
								<button>Delete Profile</button>
							</div> */}
						</div>
					</div>
				</div>
			) : (
				<div className="user-dashboard-authentication-error-div">
					<p className="user-dashboard-authentication-error">
						"You are not Authenticated, please log in!"
					</p>
					<Link to="/login" className="heading-font">
						Sign in
					</Link>
				</div>
			)}
		</div>
	);
};

export default UserDashboard;
