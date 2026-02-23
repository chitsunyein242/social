import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { 
    Home as HomeIcon,
    Person as ProfileIcon,
    PersonAdd as RegisterIcon,
    Login as LoginIcon,
    Logout as LogoutIcon,
} from "@mui/icons-material";

import { grey } from "@mui/material/colors";
import { useApp } from "../AppProvider";
import { useNavigate } from "react-router";

export default function AppDrawer() {
	const { openDrawer, setOpenDrawer, auth, setAuth } = useApp();
    const navigate = useNavigate();

	return (
		<Drawer
			open={openDrawer}
			onClose={() => setOpenDrawer(false)}
			onClick={() => setOpenDrawer(false)}>
			<Box sx={{ height: 150, width: 250, background: grey[500] }}></Box>
			<List>
				<ListItem>
					<ListItemButton onClick={() => navigate("/")}>
						<ListItemIcon>
							<HomeIcon />
						</ListItemIcon>
						<ListItemText primary="Home" />
					</ListItemButton>
				</ListItem>
				<Divider />

				{auth && (
					<>
						<ListItem>
							<ListItemButton
								onClick={() => navigate("/profile")}>
								<ListItemIcon>
									<ProfileIcon />
								</ListItemIcon>
								<ListItemText primary="Profile" />
							</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton onClick={() => {
                                setAuth(undefined);
                                localStorage.removeItem("token");
                            }}>
								<ListItemIcon>
									<LogoutIcon />
								</ListItemIcon>
								<ListItemText primary="Logout" />
							</ListItemButton>
						</ListItem>
					</>
				)}

				{!auth && (
					<>
						<ListItem>
							<ListItemButton onClick={() => navigate("/login")}>
								<ListItemIcon>
									<LoginIcon />
								</ListItemIcon>
								<ListItemText primary="Login" />
							</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton
								onClick={() => navigate("/register")}>
								<ListItemIcon>
									<RegisterIcon />
								</ListItemIcon>
								<ListItemText primary="Register" />
							</ListItemButton>
						</ListItem>
					</>
				)}
			</List>
		</Drawer>
	);
}