import React, { useState, useEffect, Component } from "react";
import { AppBar, Box, Toolbar, Typography, Button} from '@mui/material';
import ModalComponent from '../util/modal';
import logo from '../styles/image/logo.png';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Constant from '../util/constant_variables';
import WebServiceManager from '../util/webservice_manager';

import MyStorage from '../util/redux_storage';

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
            this.callLogoutAPI().then(() => {
                window.location.href = "/";
                MyStorage.dispatch({ type: "Logout" });
            })
    };
    //로그아웃하는 API
    async callLogoutAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/logout", "post");
        let response = await manager.start();
        if (response.ok)
            return response.json();
    }
    render() {
        return (
            <>
                {
                    this.state.open === true && <ModalComponent handleSubmit={this.handleSubmit} handleOpenClose={this.handleOpenClose} message={"로그아웃하시겠습니까?"}/>
                }
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                <Link to="/PostList"><img src={logo} width={100} /></Link>
                            </Typography>
                            <Button color="inherit" onClick={this.handleOpenClose}>LOGOUT</Button>
                        </Toolbar>
                    </AppBar>
                </Box>
            </>

        );
    }

}


