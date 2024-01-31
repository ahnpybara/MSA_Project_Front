import React, { Component } from 'react';
import { Button, Box, TextField, Container, Modal, Typography } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import UndoIcon from '@mui/icons-material/Undo';

import ModalComponent from '../../util/modal';
import Constant from '../../util/constant_variables';
import MyStorage from '../../util/redux_storage';

import axios from 'axios';
export default class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false, //모달창
            postTitle: '',
            postContent: '',
            titleError: false,
            contentError: false,
        };

    }
    cancel = () => {
        window.location.href = "/postList";
    }
    handleOpenClose = (e) => {
        e.preventDefault();
        const titleError = this.state.postTitle === '';
        const contentError = this.state.postContent === '';
        if (!titleError && !contentError) {
            this.setState({ open: !this.state.open });
        } else {
            this.setState({ titleError, contentError });
        }

    }
    //API가기 전에 체크
    handleSubmit = async () => {
        this.callAddPostAPI().then(() => {
            this.setState({ open: false });
            window.location.href = "/postList";
        })
    };

    //게시글 포스트 하는 API
    async callAddPostAPI() {
        //보낼 데이터
        const formData = {
            title: this.state.postTitle,
            content: this.state.postContent,
            nickname: MyStorage.getState().nickname,
            userId: MyStorage.getState().userId,
        };
        try {
            const response = await axios.post(Constant.serviceURL + '/posts', formData);
            console.log('서버 응답:', response.data);
        } catch (error) {
            console.error('오류 발생:', error);
        }
    }
    render() {
        return (
            <Container>
                 <ModalComponent open={this.state.open} handleSubmit={this.handleSubmit} handleOpenClose={this.handleOpenClose} message={"포스트 하시겠습니까?"} />
                
                <Box
                    component="form"
                    className="component-column"
                    sx={{ '& .MuiTextField-root': { mb: 1 } }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        placeholder="제목"
                        size="small"
                        onChange={(e) => this.setState({ postTitle: e.target.value })}
                        error={this.state.titleError}
                        helperText={this.state.titleError && '제목을 입력해주세요.'}
                    />
                    <TextField
                        placeholder="내용을 입력해주세요."
                        multiline
                        rows={20}
                        onChange={(e) => this.setState({ postContent: e.target.value })}
                        error={this.state.contentError}
                        helperText={this.state.contentError && '내용을 입력해주세요.'}
                    />

                </Box>
                <div className="component-footer">

                    <Button variant="outlined" endIcon={<UndoIcon />} onClick={this.cancel} style={{ marginRight: '8px' }}>취소</Button>
                    <Button variant="contained" endIcon={<CreateIcon />} onClick={this.handleOpenClose}>글쓰기</Button>
                </div>

            </Container>)
    }
}

