import { Box, OutlinedInput, Button, Typography } from "@mui/material";
import Post from "../components/Post";
import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApp } from "../AppProvider";

const api = "http://localhost:8800";

export default function Posts() {
	const { auth } = useApp();
	const queryClient = useQueryClient();
	const [content, setContent] = useState("");

	const addPost = useMutation({
		mutationFn: async newContent => {
			if (!newContent.trim()) {
				throw new Error("Post content is required");
			}

			const token = localStorage.getItem("token");

			if (!token) {
				throw new Error("Please login to add a post");
			}

			const res = await fetch(`${api}/posts`, {
				method: "POST",
				body: JSON.stringify({ content: newContent }),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body.msg || "Unable to create post");
			}

			return res.json();
		},
		onSuccess: () => {
			setContent("");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			if (auth?.id) {
				queryClient.invalidateQueries({
					queryKey: ["posts", "profile", auth.id],
				});
			}
		},
	});

	const { data: posts, error, isLoading } = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			const res = await fetch(`${api}/posts`);
			return res.json();
		},
	});

	const handleAddPost = event => {
		event.preventDefault();
		addPost.reset();

		if (!content.trim()) {
			return;
		}

		addPost.mutate(content.trim());
	};

	if (isLoading) {
		return (
			<Box>
				<Typography>Loading...</Typography>
			</Box>
		);
	}

	if (error) {
		return (
			<Box>
				<Typography>{error}</Typography>
			</Box>
		);
	}

	return (
		<Box>
			<Box sx={{ mb: 2, textAlign: "right" }}>
				{!auth && (
					<Typography sx={{ textAlign: "left", mb: 1 }} color="text.secondary">
						Login to share what&apos;s on your mind.
					</Typography>
				)}
				<form onSubmit={handleAddPost}>
					<OutlinedInput
						fullWidth
						placeholder="What's on your mind..."
						sx={{ mb: 1 }}
						value={content}
						onChange={event => setContent(event.target.value)}
						disabled={!auth || addPost.isPending}
					/>
					{addPost.isError && (
						<Typography color="error" sx={{ mb: 1, textAlign: "left" }}>
							{addPost.error.message}
						</Typography>
					)}
					<Button
						variant="contained"
						type="submit"
						disabled={!auth || addPost.isPending}>
						{addPost.isPending ? "Posting..." : "Add Post"}
					</Button>
				</form>
			</Box>

			{posts.map(post => {
				return <Post key={post.id} post={post} />;
			})}
		</Box>
	);
}