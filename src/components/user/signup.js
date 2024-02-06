import React, { useState, useRef } from 'react';
import { Button, Box, TextField, Container, FormControl, Select, MenuItem, Modal, Typography } from '@mui/material';
import ModalComponent from '../../util/modal';
import Constant from '../../util/constant_variables';
import axios from 'axios';

export default function Signup() {
    const emailMenus = Constant.getEmailMenus();

    const [open, setOpen] = useState(false);
    const [subOpen, setSubOpen] = useState(false);
    
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [select, setSelect] = useState(emailMenus[0].value); // 선택된 이메일 드롭리스트

    const [emailError, setEmailError] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [nicknameError, setNicknameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [DuplicateCheck, setDuplicateCheck] = useState(false);

    const handleOpenClose = () => {
        //에러 모음
        const errors = {
            emailError: email === '',
            nameError: name === '',
            nicknameError: nickname === '',
            passwordError: password === '',
            confirmPasswordError: confirmPassword === '' || password !== confirmPassword
        };

        if (!errors.emailError && !errors.nameError && !errors.nicknameError && !errors.passwordError && !errors.confirmPasswordError) {
            if (password !== confirmPassword) {
                setConfirmPasswordError(errors.confirmPasswordError);
            }
            else {
                setOpen(!open);
            }
        } else {
            setConfirmPasswordError(errors.confirmPasswordError);
            setEmailError(errors.emailError);
            setNameError(errors.nameError);
            setNicknameError(errors.nicknameError);
            setPasswordError(errors.passwordError);
        }

    }
    //API가기 전에 체크
    const handleSubmit = () => {
        callAddUserAPI().then((response) => {
            console.log('addUser', response);
            //보충 필요 response가 뭐일때 ok할지...
            if (response) {
                setSubOpen(!subOpen)
            }
        })
    }
    //회원가입 하는 API
    async function callAddUserAPI() {
        //회원가입할때 보낼 데이터
        const formData = {
            email: email + '@' + select,
            name: name,
            nickname: nickname,
            password: password
        };
        try {
            const response = await axios.post(Constant.serviceURL + '/users/register', formData, { withCredentials: true });
            console.log('서버 응답:', response.data);
            return response.data;
        } catch (error) {
            console.error('오류 발생:', error);
            setDuplicateCheck(true);
            setOpen(false);
        }
    }
    return (
        <Container maxWidth="sm">
            <ModalComponent open={open} subOpen={subOpen} handleSubmit={handleSubmit} handleOpenClose={handleOpenClose} message={"회원가입 하시겠습니까?"} />

            <Box
                component="form"
                className="component-column"
                sx={{ '& .MuiTextField-root': { mb: 3 }, marginTop: '40%' }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    size="small"
                    placeholder="이름"
                    onChange={(e) => { setName(e.target.value) }}
                    error={nameError}
                    helperText={nameError && '이름을 입력하세요.'}
                />
                <TextField
                    size="small"
                    placeholder="닉네임"
                    onChange={(e) => {setNickname(e.target.value) }}
                    error={nicknameError}
                    helperText={nicknameError && '닉네임을 입력하세요.'}
                />
                <Box sx={{ display: 'flex' }}>
                    <TextField
                        size="small"
                        placeholder='이메일'
                        onChange={(e) => { setEmail(e.target.value) }}
                        error={emailError}
                        helperText={emailError && '이메일을 입력하세요.'}
                        sx={{ flex: 1 }}
                    />
                    <p>@</p>
                    <FormControl sx={{ flex: 1 }}>
                        <Select
                            value={select}
                            onChange={(e) => { setSelect(e.target.value) }}
                            sx={{ width: '100%' }}
                            size="small">
                            {emailMenus.map((email, i) => (
                                <MenuItem key={i} value={email.value}>
                                    {email.value}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <TextField
                    size="small"
                    placeholder="비밀번호"
                    type="password"
                    onChange={(e) => { setPassword(e.target.value) }}
                    error={passwordError}
                    helperText={passwordError && '비밀번호를 입력하세요.'}
                />
                <TextField
                    size="small"
                    placeholder="비밀번호 확인"
                    type="password"
                    onChange={(e) => { setConfirmPassword(e.target.value) }}
                    error={confirmPasswordError}
                    helperText={confirmPasswordError && '비밀번호가 맞지 않습니다.'}
                />
                {
                    DuplicateCheck === true && <p style={{ color: 'red' }}>다른 사용자가 있습니다. 다른 이메일로 바꿔주세요</p>
                }
                <Button variant="contained" sx={{ mt: 2 }} onClick={handleOpenClose}>회원가입</Button>
            </Box>

        </Container>
    )
}