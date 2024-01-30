import React, { Component } from 'react';
import { Button, Box, TextField, Container, Modal, Typography } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import UndoIcon from '@mui/icons-material/Undo';

import ModalComponent from '../../util/modal';
import Constant from '../../util/constant_variables';

import axios from 'axios';

export default class Modify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false, //모달창
            postTitle: this.props.data.postTitle,
            postContent: this.props.data.postContent,
            titleError: false,
            contentError: false,
            data: this.props.data,
        }
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
    //API가기전에 체크
    handleSubmit = () => {
        this.callAddPostAPI().then(() => {
            this.setState({ open: false });
            window.location.href = "/";
        })
    }
    //게시글 수정 API  
    async callAddPostAPI() {
        const formData = {
            id: this.props.data.postId,
            title: this.state.postTitle,
            content: this.state.postContent,
        };
        try {
            const response = await axios.patch(Constant.serviceURL + `/posts/${this.props.data.postId}`, formData);
            console.log('서버 응답:', response.data);
        } catch (error) {
            console.error('오류 발생:', error);
            alert(error); // 사용자에게 오류 내용을 알립니다.
        }
    }
    render() {
        console.log(this.props.data.postId)
        return (
            <Container>
                {
                    this.state.open === true && <ModalComponent handleSubmit={this.handleSubmit} handleOpenClose={this.handleOpenClose} message={"수정하시겠습니까?"} />
                }
                <Box
                    component="form"
                    className="component-column"
                    sx={{ '& .MuiTextField-root': { mb: 1 } }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        label="제목"
                        defaultValue={this.state.data.postTitle}
                        size="small"
                        onChange={(e) => this.setState({ postTitle: e.target.value })}
                        error={this.state.titleError}
                        helperText={this.state.titleError && '제목을 입력해주세요.'}
                        variant="filled"
                    />
                    <TextField
                        defaultValue={this.state.data.postContent}
                        multiline
                        rows={20}
                        onChange={(e) => this.setState({ postContent: e.target.value })}
                        error={this.state.contentError}
                        helperText={this.state.contentError && '내용을 입력해주세요.'}
                    />

                </Box>
                <div className="component-footer">
                    <Button variant="outlined" endIcon={<UndoIcon />} onClick={this.props.postModify} style={{ marginRight: '8px' }}>취소</Button>
                    <Button variant="contained" endIcon={<CreateIcon />} onClick={this.handleOpenClose}>수정</Button>
                </div>

            </Container>)
    }

}