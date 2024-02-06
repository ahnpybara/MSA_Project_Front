
import React, { useState } from "react";
import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import logo from '../styles/image/logo.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Constant from '../util/constant_variables';
import { useDispatch, useSelector } from 'react-redux';
import ModalComponent from '../util/modal';

export default function Menubar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    //const { userId: userId } = useSelector((state) => state.userId); //리덕스에 있는 userId를 가져옴

    const handleOpenClose = () => {
        setOpen(!open);
    };

    const handleSubmit = () => {
        callLogoutAPI().then((response) => {
            if (response) {
                dispatch({ type: "Logout" });
                navigate("/");
            }
        })
    };
    //로그아웃하는 API
    async function callLogoutAPI() {
        //로그아웃 로직 
        return '굳';
        // try {
        //     const response = await axios.get(Constant.serviceURL + `/logout`, { withCredentials: true });
        //     return response;
        // }
        // catch (error) {
        //     console.error('로그아웃 오류:', error);
        // }
    };
    return (
        <>
            <ModalComponent open={open} handleSubmit={handleSubmit} handleOpenClose={handleOpenClose} message={"로그아웃하시겠습니까?"} />

            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <Link to="/PostList"><img src={logo} width={100} /></Link>
                        </Typography>
                        <Button color="inherit" onClick={handleOpenClose}>LOGOUT</Button>
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    );
}