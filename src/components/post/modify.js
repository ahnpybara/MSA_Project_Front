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
            data: this.props.data,
        }
    }
    submit = () => {
        const titleError = this.state.title === '';
        const contentError = this.state.content === '';

        if (!titleError && !contentError) {
            if (window.confirm("수정 하시겠습니까?")) {
                this.callAddPostAPI().then((response) => {
                    console.log('modifyPost', response);
                    if (response.success > 0) {
                        alert('수정 완료되었습니다!');
                        window.location.href = "/postList";
                    }
                })
            }
        } else {
            this.setState({ titleError, contentError });
        }
    }
    //수정 로직   
    async callAddPostAPI() {
        const formData = {
            postTitle: this.state.postTitle,
            postContent: this.state.postContent,
            postNickname: this.props.data.postNickname,
            postUserId: this.props.data.postUserId,
        };
        let manager = new WebServiceManager(Constant.serviceURL + "/posts", "post");
        manager.addFormData("data", formData); //넣을 데이터

        console.log(formData);
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
                        defaultValue={this.state.data.postTitle}
                        size="small"
                        onChange={(e) => this.setState({ title: e.target.value })}
                        error={this.state.titleError}
                        helperText={this.state.titleError && '제목을 입력해주세요.'}
                        variant="filled"
                    />
                    <TextField
                        defaultValue={this.state.data.postContent}
                        multiline
                        rows={20}
                        onChange={(e) => this.setState({ content: e.target.value })}
                        error={this.state.contentError}
                        helperText={this.state.contentError && '내용을 입력해주세요.'}
                    />

                </Box>
                <div className="component-footer">
                    <Button variant="contained" endIcon={<CreateIcon />} onClick={this.submit}>수정</Button>
                </div>

            </Container>)
    }

}