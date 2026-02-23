import { Box, Typography } from "@mui/material";
import Post from "../components/Post";
import { useApp } from "../AppProvider";
import { useQuery } from "@tanstack/react-query";

const api = "http://localhost:8800";

export default function Profile() {
	const { auth } = useApp();

	const {
		data: posts,
		error,
		isLoading,
	} = useQuery({
		queryKey: ["posts", "profile", auth?.id],
		queryFn: async () => {
			const res = await fetch(`${api}/posts?userId=${auth.id}`);
			return res.json();
		},
		enabled: Boolean(auth?.id),
	});

	if (!auth) {
		return (
			<Box>
				<Typography>Please login to view your profile.</Typography>
			</Box>
		);
	}

	return (
		<Box>
			<Box sx={{ mb: 4 }}>
				<Typography variant="h4">{auth.name}</Typography>
				<Typography color="text.secondary">@{auth.username}</Typography>
				{auth.bio && (
					<Typography sx={{ mt: 1 }}>{auth.bio}</Typography>
				)}
			</Box>

			<Typography variant="h5" sx={{ mb: 2 }}>
				Posts
			</Typography>

			{isLoading && (
				<Typography sx={{ mb: 2 }}>Loading posts...</Typography>
			)}

			{error && (
				<Typography color="error" sx={{ mb: 2 }}>
					Unable to load posts.
				</Typography>
			)}

			{posts && posts.length === 0 && (
				<Typography>No posts yet.</Typography>
			)}

			{posts &&
				posts.map(post => {
					return <Post key={post.id} post={post} />;
				})}
		</Box>
	);
}