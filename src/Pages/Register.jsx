import { Box, Typography, OutlinedInput, Button } from "@mui/material";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const api = "http://localhost:8800";

export default function Register() {
    const navigate = useNavigate();

    const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

    const createUser = async data => {
        const res = await fetch(`${api}/users`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if(res.ok) {
            navigate("/login");
        }
    }

	return (
		<Box>
			<Box>
				<Typography
					variant="h3"
					sx={{ mb: 4 }}>
					Register
				</Typography>
				<form onSubmit={handleSubmit(createUser)}>
					<OutlinedInput
						fullWidth
						sx={{ mt: 1 }}
						placeholder="name"
						{...register("name", { required: true })}
					/>
					{errors.name && (
						<Typography color="error">Name is required</Typography>
					)}

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
						fullWidth
						sx={{ mt: 1 }}
						placeholder="bio"
						{...register("bio")}
					/>

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
						Register
					</Button>
				</form>
			</Box>
		</Box>
	);
}