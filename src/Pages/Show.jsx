import { Box, Button, OutlinedInput, Typography } from "@mui/material";
import Post from "../components/Post";
import Comment from "../components/Comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useApp } from "../AppProvider";
import { useState } from "react";

const api = "http://localhost:8800";

export default function Show() {
	const { id } = useParams();
	const { auth } = useApp();
	const queryClient = useQueryClient();
	const [commentContent, setCommentContent] = useState("");

	const { data: post, error, isLoading } = useQuery({
		queryKey: ["posts", id],
		queryFn: async () => {
			const res = await fetch(`${api}/posts/${id}`);
			return res.json();
		},
	});

	const addComment = useMutation({
		mutationFn: async content => {
			if (!content.trim()) {
				throw new Error("Comment is required");
			}

			const token = localStorage.getItem("token");

			if (!token) {
				throw new Error("Please login to reply");
			}

			const res = await fetch(`${api}/posts/${id}/comments`, {
				method: "POST",
				body: JSON.stringify({ content }),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body.msg || "Unable to add comment");
			}

			return res.json();
		},
		onSuccess: () => {
			setCommentContent("");
			queryClient.invalidateQueries({ queryKey: ["posts", id] });
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			if (post?.userId) {
				queryClient.invalidateQueries({
					queryKey: ["posts", "profile", post.userId],
				});
			}
		},
	});

	const handleAddComment = event => {
		event.preventDefault();
		addComment.reset();

		if (!commentContent.trim()) {
			return;
		}

		addComment.mutate(commentContent.trim());
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

	if (!post) {
		return (
			<Box>
				<Typography>Post not found.</Typography>
			</Box>
		);
	}

	return (
		<Box>
			<Post post={post} />

			<Box sx={{ mb: 2, textAlign: "right" }}>
				{!auth && (
					<Typography sx={{ textAlign: "left", mb: 1 }} color="text.secondary">
						Login to join the conversation.
					</Typography>
				)}
				<form onSubmit={handleAddComment}>
					<OutlinedInput
						fullWidth
						placeholder="Your reply..."
						sx={{ mb: 1 }}
						value={commentContent}
						onChange={event => setCommentContent(event.target.value)}
						disabled={!auth || addComment.isPending}
					/>
					{addComment.isError && (
						<Typography color="error" sx={{ mb: 1, textAlign: "left" }}>
							{addComment.error.message}
						</Typography>
					)}
					<Button
						variant="contained"
						type="submit"
						disabled={!auth || addComment.isPending}>
						{addComment.isPending ? "Posting..." : "Add Comment"}
					</Button>
				</form>
			</Box>

			{post.comments &&
				post.comments.map(comment => {
					return <Comment key={comment.id} comment={comment} />;
				})}
		</Box>
	);
}