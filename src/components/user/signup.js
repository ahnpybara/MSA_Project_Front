import React, { Component } from 'react';
import { Button, Box, TextField, Container, FormControl, Select, MenuItem } from '@mui/material';
import Constant from '../../util/constant_variables';
import WebServiceManager from '../../util/webservice_manager';

import axios from 'axios';
export default class Signup extends Component {
    constructor(props) {
        super(props);
        this.emailMenus = Constant.getEmailMenus();
        this.state = {
            email: '',
            name: '',
            nickname: '',
            password: '',
            confirmPassword: '',
            select: this.emailMenus[0].value, //선택된 이메일 드롭리스트

            emailError: false,
            nameError: false,
            nicknameError: false,
            passwordError: false,
            confirmPasswordError: false,
        }
    }
    submit = () => {
        const emailError = this.state.email === '';
        const nameError = this.state.name === '';
        const nicknameError = this.state.nickname === '';
        const passwordError = this.state.password === '';
        const confirmPasswordError = this.state.confirmPassword === '' || this.state.password !== this.state.confirmPassword;

        if (!emailError && !nameError && !nicknameError && !passwordError && !confirmPasswordError) {
            if (this.state.password !== this.state.confirmPassword) {
                this.setState({ confirmPasswordError });
            }
            else {
                if (window.confirm("회원가입 하시겠습니까?")) {
                    this.callAddUserAPI().then((response) => {
                        console.log('addUser', response);
                        if (response.success > 0) {
                            alert('회원가입이 완료되었습니다!');
                            window.location.href = "/";
                        }
                    })
                }
            }
        } else {
            this.setState({ emailError, nameError, nicknameError, passwordError, confirmPasswordError });
        }
    }
    //회원가입 하는 API ***URL 수정 필요
    async callAddUserAPI() {
        const formData = {
            email: this.state.email + '@' + this.state.select,
            name: this.state.name,
            nickname: this.state.nickname,
            password: this.state.password
        };
        let manager = new WebServiceManager(Constant.serviceURL + "/users", "post");
        manager.addFormData("data", formData); //넣을 데이터
        console.log(formData);
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
                    sx={{ '& .MuiTextField-root': { mb: 3 }, marginTop: '40%' }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        id="outlined-required"
                        size="small"
                        placeholder="이름"
                        onChange={(e) => this.setState({ name: e.target.value })}
                        error={this.state.nameError}
                        helperText={this.state.nameError && '이름을 입력하세요.'}
                    />
                    <TextField
                        id="outlined-required"
                        size="small"
                        placeholder="닉네임"
                        onChange={(e) => this.setState({ nickname: e.target.value })}
                        error={this.state.nicknameError}
                        helperText={this.state.nicknameError && '닉네임을 입력하세요.'}
                    />
                    <Box sx={{ display: 'flex' }}>
                        <TextField
                            id="outlined-required"
                            size="small"
                            placeholder='이메일'
                            onChange={(e) => this.setState({ email: e.target.value })}
                            error={this.state.emailError}
                            helperText={this.state.emailError && '이메일을 입력하세요.'}
                            sx={{ flex: 1 }}
                        />
                        <p>@</p>
                        <FormControl sx={{ flex: 1 }}>
                            <Select
                                value={this.state.select}
                                onChange={(e) => this.setState({ select: e.target.value })}
                                sx={{ width: '100%' }}
                                size="small">
                                {this.emailMenus.map((email, i) => (
                                    <MenuItem key={i} value={email.value}>
                                        {email.value}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <TextField
                        id="outlined-required"
                        size="small"
                        placeholder="비밀번호"
                        type="password"
                        onChange={(e) => this.setState({ password: e.target.value })}
                        error={this.state.passwordError}
                        helperText={this.state.passwordError && '비밀번호를 입력하세요.'}
                    />
                    <TextField
                        id="outlined-required"
                        size="small"
                        placeholder="비밀번호 확인"
                        type="password"
                        onChange={(e) => this.setState({ confirmPassword: e.target.value })}
                        error={this.state.confirmPasswordError}
                        helperText={this.state.confirmPasswordError && '비밀번호가 맞지 않습니다.'}
                    />

                    <Button variant="contained" sx={{ mt: 2 }} onClick={this.submit}>회원가입</Button>
                </Box>

            </Container>
        )
    }

}