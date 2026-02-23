import {
	Avatar,
	Box,
	Card,
	CardContent,
	Typography,
	IconButton,
	ButtonGroup,
	Button,
} from "@mui/material";
import { green } from "@mui/material/colors";
import {
	FavoriteBorder as LikeIcon,
	ChatBubble as CommentIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApp } from "../AppProvider";

const api = "http://localhost:8800";

export default function Post({ post }) {
	const navigate = useNavigate();
	const { auth } = useApp();
	const queryClient = useQueryClient();

	const hasLiked =
		auth && post.likes
			? post.likes.some(like => like.userId === auth.id)
			: false;
	const likeCount = post.likes ? post.likes.length : 0;

	const toggleLike = useMutation({
		mutationFn: async action => {
			const token = localStorage.getItem("token");

			if (!token) {
				throw new Error("Please login to like posts");
			}

			const endpoint =
				action === "like"
					? `${api}/posts/${post.id}/like`
					: `${api}/posts/${post.id}/unlike`;

			const res = await fetch(endpoint, {
				method: action === "like" ? "POST" : "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body.msg || "Unable to update like");
			}

			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			queryClient.invalidateQueries({ queryKey: ["posts", post.id] });
			if (post?.userId) {
				queryClient.invalidateQueries({
					queryKey: ["posts", "profile", post.userId],
				});
			}
		},
	});

	const handleLikeClick = () => {
		toggleLike.reset();

		if (!auth) {
			return;
		}

		toggleLike.mutate(hasLiked ? "unlike" : "like");
	};

	const commentCount = post.comments ? post.comments.length : 0;

	return (
		<Card sx={{ mb: 2 }}>
			<CardContent sx={{ display: "flex", gap: 2 }}>
				<Avatar sx={{ background: green[500], width: 64, height: 64 }}>
					{post.user.name[0]}
				</Avatar>
				<Box>
					<Typography>{post.user.name}</Typography>
					<Typography sx={{ fontSize: 12, color: green[500] }}>
						a few minutes ago
					</Typography>
					<Typography
						sx={{ mt: 1 }}
						onClick={() => navigate(`/show/${post.id}`)}>
						{post.content}
					</Typography>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-around",
							mt: 2,
						}}>
						<ButtonGroup>
							<IconButton
								size="small"
								onClick={handleLikeClick}
								disabled={!auth || toggleLike.isPending}>
								<LikeIcon color="error" />
							</IconButton>
							<Button size="small" variant="text">
								{likeCount}
							</Button>
						</ButtonGroup>
						<ButtonGroup>
							<IconButton size="small">
								<CommentIcon color="success" />
							</IconButton>
							<Button size="small" variant="text">
								{commentCount}
							</Button>
						</ButtonGroup>
					</Box>
				</Box>
			</CardContent>
		</Card>
	);
}