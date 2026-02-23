import { Box, Container } from "@mui/material";
import Header from "./components/Header";
import AppDrawer from "./components/AppDrawer";
import { Outlet } from "react-router";

export default function App() {
    return <Box>
        <Header />
        <AppDrawer />
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Outlet />
        </Container>
    </Box>
}