import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

import App from "./App";
import Posts from "./pages/Posts";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Show from "./pages/Show";
import Profile from "./pages/Profile";

const AppContext = createContext();

import { createBrowserRouter, RouterProvider } from "react-router";

let router = createBrowserRouter([
	{
		path: "/",
		Component: App,
		children: [
			{
				path: "/",
				Component: Posts,
			},
			{
				path: "/login",
				Component: Login,
			},
			{
				path: "/register",
				Component: Register,
			},
			{
				path: "/show/:id",
				Component: Show,
			},
			{
				path: "/profile",
				Component: Profile,
			},
		],
	},
]);

const api = "http://localhost:8800";

export default function AppProvider() {
	const [mode, setMode] = useState("dark");
    const [openDrawer, setOpenDrawer] = useState(false);
    const [auth, setAuth] = useState();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token) {
            fetch(`${api}/users/verify`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }).then(async res => {
                if(res.ok) {
                    setAuth(await res.json());
                }
            });
        }
    }, []);

	const theme = useMemo(() => {
		console.log("running create theme function");
		return createTheme({
			palette: {
				mode,
			},
		});
	}, [mode]);

	return (
		<AppContext.Provider
			value={{ mode, setMode, openDrawer, setOpenDrawer, auth, setAuth }}>
			<ThemeProvider theme={theme}>
				<QueryClientProvider client={queryClient}>
					<RouterProvider router={router} />
					<CssBaseline />
				</QueryClientProvider>
			</ThemeProvider>
		</AppContext.Provider>
	);
}

export function useApp() {
	return useContext(AppContext);
}