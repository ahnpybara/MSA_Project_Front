import React, { useState } from 'react';
import { Button, Box, TextField, Container, Modal, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import CreateIcon from '@mui/icons-material/Create';
import UndoIcon from '@mui/icons-material/Undo';
import CircularProgress from '@mui/material/CircularProgress';

import ModalComponent from '../../util/modal';
import Constant from '../../util/constant_variables';
import MyStorage from '../../util/redux_storage';

import axios from 'axios';

export default function Create() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true); //로딩
    const [open, setOpen] = useState(false); //모달창
    const [postTitle, setPostTitle] = useState(''); //포스트 제목
    const [postContent, setPostContent] = useState(''); //포스트 내용
    const [titleError, setTitleError] = useState(false); //포스트 제목 에러
    const [contentError, setContentError] = useState(false); //포스트 내용 에러

    const { nickname, userId } = useSelector((state) => ({ nickname: state.nickname, userId: state.userId }));
    //리덕스에 저장되어있던 nickname,userId를 가져옴

    const handleOpenClose = (e) => {
        e.preventDefault(); //데이터를 보낼때나 페이지 이동시 그 동작을 중지시키는 역할 !중요!
        //에러모음
        let errors = {
            titleError: postTitle === '' || postTitle.length > 25,
            contentError: postContent === '' || postContent.length > 100,
        };

        if (!errors.titleError && !errors.contentError) {
            setOpen(!open);
        } else {
            setTitleError(errors.titleError);
            setContentError(errors.contentError);
        }

    }
    //API가기 전에 체크
    const handleSubmit = async () => {
        setLoading(true); //로딩시작
        if (loading === true) {
            callAddPostAPI().then((response) => {
                if (response) {
                    setLoading(false); //로딩끝
                    setOpen(false);
                    navigate("/PostList");
                }
            });
            return (<Box className="loading">
                <CircularProgress />
            </Box>)
        }

    };

    //게시글 포스트 하는 API
    async function callAddPostAPI() {
        //포스트 보낼 데이터
        const formData = {
            title: postTitle,
            content: postContent,
            nickname: nickname,
            userId: userId,
        };
        try {
            const response = await axios.post(Constant.serviceURL + '/posts', formData, { withCredentials: true });
            console.log('서버 응답:', response.data);
            return response;
        } catch (error) {
            console.error('오류 발생:', error);
            setLoading(false); //로딩끝
        }
    }
    return (
        <Container>

            <ModalComponent open={open} handleSubmit={handleSubmit} handleOpenClose={handleOpenClose} message={"포스트 하시겠습니까?"} />

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
                    onChange={(e) => { setPostTitle(e.target.value) }}
                    error={titleError}
                    helperText={titleError && '제목을 제대로 입력해주세요 (25자 이내)'}
                />
                <TextField
                    placeholder="내용을 입력해주세요."
                    multiline
                    rows={20}
                    onChange={(e) => { setPostContent(e.target.value) }}
                    error={contentError}
                    helperText={contentError && '제목을 제대로 입력해주세요 (100자 이내)'}
                />
            </Box>
            <div className="component-footer">

                <Button variant="outlined" endIcon={<UndoIcon />} onClick={() => { navigate("/PostList") }} style={{ marginRight: '8px' }}>취소</Button>
                <Button variant="contained" endIcon={<CreateIcon />} onClick={(e) => handleOpenClose(e)}>글쓰기</Button>
            </div>

        </Container>)
}


