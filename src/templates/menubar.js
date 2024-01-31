import React, { useState, useEffect, Component } from "react";
import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material';

import logo from '../styles/image/logo.png';

import { Link } from 'react-router-dom';
import axios from 'axios';

import Constant from '../util/constant_variables';
import MyStorage from '../util/redux_storage';
import ModalComponent from '../util/modal';
export default class Menubar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        }
    }
    handleOpenClose = () => {
        this.setState({ open: !this.state.open });
    }
    handleSubmit = () => {
         this.callLogoutAPI().then((response) => {
            MyStorage.dispatch({ type: "Logout" });
            console.log("로그아웃 response : ", response);
            window.location.href = "/postList"; //아 이거 바꿔야되는데 
         })
    }
    //로그아웃하는 API
    async callLogoutAPI() {
        //로그아웃 로직 
        try {
            const response = await axios.get(Constant.serviceURL + `/logout`, { withCredentials: true });
            return response;
        }
        catch (error) {
            console.error('로그아웃 오류:', error);
        }
    }
    render() {
        console.log("지금 로그인/로그아웃 상태를 알려줌 : ", MyStorage.getState());
        return (
            <>
                <ModalComponent open={this.state.open} handleSubmit={this.handleSubmit} handleOpenClose={this.handleOpenClose} message={"로그아웃하시겠습니까?"} />

                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                <Link to="/postList"><img src={logo} width={100} /></Link>
                            </Typography>
                            {
                                MyStorage.getState().userId === 0 ? <Button color="inherit" onClick={() => { window.location.href = '/Login' }}>LOGIN</Button> :
                                    <Button color="inherit" onClick={this.handleOpenClose}>LOGOUT</Button>

                            }

                        </Toolbar>
                    </AppBar>
                </Box>
            </>

        );
    }

}


