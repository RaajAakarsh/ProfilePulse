import React from "react";
import "../styles/navbar.css";
import { Link } from "react-router-dom";

const Navbar = (props) => {
	const { setName } = props;
	const Logout = async () => {
		const response = await fetch("http://localhost:8000/api/logout", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		});
		setName("");
		if (response.ok) {
			const content = await response.json();
			console.log(content.message);
		}
	};
	let menu;
	if (props.name === "") {
		menu = (
			<ul className="navbar-menu">
				<li>
					<Link className="heading-font nav-hover-shadow" to="/login">
						Login
					</Link>
				</li>
				<li>
					<Link className="heading-font nav-hover-shadow" to="/register">
						Register
					</Link>
				</li>
			</ul>
		);
	} else {
		menu = (
			<ul className="navbar-menu">
				<li>
					<Link className="heading-font nav-hover-shadow" to="/users">
						Users
					</Link>
				</li>
				<li>
					<Link className="heading-font nav-hover-shadow" to="/login" onClick={Logout}>
						Logout
					</Link>
				</li>
			</ul>
		);
	}
	return (
		<div className="nav-container">
			<div className="nav-item-logo ">
				<Link to="/" className="heading-font">
					ProfilePulse
				</Link>
			</div>
			<div className="nav-item-status heading-font">{menu}</div>
		</div>
	);
};

export default Navbar;
