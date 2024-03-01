import React from "react";
import "../styles/home.css";
import UserDashboard from "../components/user-dashboard";

const Home = (props) => {

	return (
		<div className="home-container">
			<UserDashboard {...props}/>
		</div>
	);
};

export default Home;
