import React, { Component } from 'react';
import { Button, Box, TextField, Container } from '@mui/material';

import Constant from '../../util/constant_variables';
import WebServiceManager from '../../util/webservice_manager';

import MyStorage from '../../util/redux_storage';
import axios from 'axios';
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            emailError: false,
            passwordError: false,
        };
        MyStorage.dispatch({type:""});
    }
    submit = (e) => {

        const emailError = this.state.email === '';
        const passwordError = this.state.password === '';
        if (!emailError && !passwordError) {
            this.callLoginAPI().then((response)=>{
                if(response.userId !=0){
                    // 백엔드에서 밑과 같은 데이터(userId, nickname,password)를 보내줘야함
                    MyStorage.dispatch({type:"Login",data:{userId:response.userId,nickname:response.nickname}});
                }else{
                    this.setState({ emailError, passwordError });
                }
            })
        } else {
            e.preventDefault();
            this.setState({ emailError, passwordError });
        }
    }

    //로그인하는 API
    async callLoginAPI() {
        //로그인 로직
        let manager = new WebServiceManager(Constant.serviceURL + "/login", "post");
        manager.addFormData("data", { email: this.state.email, password: this.state.password });
        let response = await manager.start();
        if (response.ok)
            return response.json();

    }
    render() {
        return (
            <Container maxWidth="sm">
                <Box
                    component="form"
                    className="component-column"
                    sx={{ '& .MuiTextField-root': { mb: 2 }, marginTop: '50%' }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        id="outlined-required"
                        label="이메일"
                        size="small"
                        error={this.state.emailError}
                        helperText={this.state.emailError && '이메일을 제대로 입력해주세요.'}
                        onChange={(e) => this.setState({ email: e.target.value })}
                    />
                    <TextField
                        id="outlined-required"
                        size="small"
                        label="Password"
                        type="비밀번호"
                        error={this.state.passwordError}
                        helperText={this.state.passwordError && '비밀번호를 제대로 입력해주세요.'}
                        onChange={(e) => this.setState({ password: e.target.value })}
                    />
                    <Button href="/postList" variant="contained" sx={{ mt: 2 }} onClick={(e) => this.submit(e)}>로그인</Button>
                </Box>

                <p>
                    <span>계정이 없으신가요? </span>
                    <Button href="/signup" >회원가입</Button>
                </p>
            </Container>
        );
    }

}