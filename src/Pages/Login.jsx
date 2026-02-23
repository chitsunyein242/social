import { Box, Button, OutlinedInput, Typography, Alert } from "@mui/material";

import { useForm } from "react-hook-form";
import { useApp } from "../AppProvider";
import { useNavigate } from "react-router";
import { useState } from "react";

const api = "http://localhost:8800";

export default function Login() {
	const navigate = useNavigate();
	const [loginError, setLoginError] = useState();
	const { setAuth } = useApp();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const login = async data => {
		const res = await fetch(`${api}/users/login`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!res.ok) {
			setLoginError("Username or password incorrect");
            return false;
		}

		const { user, token } = await res.json();
		setAuth(user);
		localStorage.setItem("token", token);

		navigate("/");
	};

	return (
		<Box>
			<Typography
				variant="h3"
				sx={{ mb: 4 }}>
				Login
			</Typography>

			{loginError && <Alert severity="warning" sx={{ mb: 2 }}>{loginError}</Alert>}

			<form onSubmit={handleSubmit(login)}>
				<OutlinedInput
					fullWidth
					sx={{ mt: 1 }}
					placeholder="username"
					{...register("username", { required: true })}
				/>
				{errors.username && (
					<Typography color="error">Username is required</Typography>
				)}

				<OutlinedInput
					type="password"
					fullWidth
					sx={{ mt: 1 }}
					placeholder="password"
					{...register("password", { required: true })}
				/>
				{errors.password && (
					<Typography color="error">Password is required</Typography>
				)}

				<Button
					sx={{ mt: 1 }}
					type="submit"
					fullWidth
					variant="contained">
					Login
				</Button>
			</form>
		</Box>
	);
}