import React, { Component } from 'react';
import { Button, Box, TextField, Container } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import Constant from '../../util/constant_variables';
import WebServiceManager from '../../util/webservice_manager';
import axios from 'axios';
export default class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            postTitle: '',
            postContent: '',
            titleError: false,
            contentError: false,
        };

    }

    //API가기 전에 체크
    handleSubmit = async (e) => {
        e.preventDefault();
        const titleError = this.state.postTitle === '';
        const contentError = this.state.postContent === '';

        if (!titleError && !contentError) {
            if(window.confirm("포스트하시겠습니까?")){
                this.callAddPostAPI();
            }
        } else {
           
            this.setState({ titleError, contentError });
        }
    };

    //게시글 포스트 하는 API
    async callAddPostAPI() {
        //보낼 데이터
        const formData = {
            postTitle: this.state.postTitle,
            postContent: this.state.postContent,
        }
        let manager = new WebServiceManager(Constant.serviceURL + "/post", "post");
        manager.addFormData("data", formData);
        let response = await manager.start();
        if (response.ok)
            return response.json();
    }
    render() {
        return (
            <Container>
                <Box
                    component="form"
                    className="component-column"
                    sx={{ '& .MuiTextField-root': { mb: 1 } }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        label="제목"
                        size="small"
                        onChange={(e) => this.setState({ postTitle: e.target.value })}
                        error={this.state.titleError}
                        helperText={this.state.titleError && '제목을 입력해주세요.'}
                        variant="filled"
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
                    <Button variant="contained" endIcon={<CreateIcon />} onClick={this.handleSubmit}>글쓰기</Button>
                </div>

            </Container>)
    }
}

