import React, { useState, useEffect } from "react";
import UserCard from "../components/userCard";
import "../styles/userCard.css";

const UsersPage = () => {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("http://localhost:8000/api/usersfetch", {
					headers: { "Content-Type": "application/json" },
					credentials: "include",
				});
				if (response.ok) {
					const content = await response.json();
					setUsers(content);
				}
			} catch (error) {
				console.error("Error fetching user datalist:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<div className="users-page-container">
			{users.map((user, index) => (
				<UserCard key={user.id} index={index + 1} name={user.name} />
			))}
		</div>
	);
};

export default UsersPage;
