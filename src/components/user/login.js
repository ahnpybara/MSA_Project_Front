import React, { Component } from 'react';
import { Button, Box, TextField, Container } from '@mui/material';

import Constant from '../../util/constant_variables';

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
            loginError: false, // 로그인 실패 여부 추가
        };
    }
    submit = async (e) => {
        e.preventDefault();
        const emailError = this.state.email === '';
        const passwordError = this.state.password === '';
        if (!emailError && !passwordError) {
            try {
                const response = await this.callLoginAPI();
                if (response.status === 200) {
                    console.log("로그인 성공 Id=", parseInt(response.data.userId), response.data.nickname);
                    MyStorage.dispatch({ type: "Login", data: { userId: parseInt(response.data.userId), nickname: response.data.nickname } });
                    window.location.href = "/PostList";
                } else {
                    this.setState({ loginError: true }); // 로그인 실패 시 loginError 상태를 true로 설정
                }
            } catch (error) {
                console.log(error);
                this.setState({ loginError: true }); // 로그인 실패 시 loginError 상태를 true로 설정
            }
        } else {
            this.setState({ emailError, passwordError });
        }
    }

    async callLoginAPI() {
        const formData = {
            email: this.state.email,
            password: this.state.password
        }
        const response = await axios.post(Constant.serviceURL + `/login`, formData, { withCredentials: true });
        return response;
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
                    {this.state.loginError && <p style={{ color: 'red' }}>로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.</p>}
                    <Button href="/PostList" variant="contained" sx={{ mt: 2 }} onClick={(e) => this.submit(e)}>로그인</Button>
                </Box>

                <p>
                    <span>계정이 없으신가요? </span>
                    <Button href="/Signup">회원가입</Button>
                </p>
            </Container>
        );
    }
}