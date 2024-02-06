import React, { useState, useEffect } from 'react';
import { Button, Box, TextField, Container, Modal, Typography } from '@mui/material';
import { useNavigate, useLocation } from "react-router-dom";
import CreateIcon from '@mui/icons-material/Create';
import UndoIcon from '@mui/icons-material/Undo';
import CircularProgress from '@mui/material/CircularProgress';

import ModalComponent from '../../util/modal';
import Constant from '../../util/constant_variables';

import axios from 'axios';

export default function Modify() {
    const navigate = useNavigate(); //경로이동하는 React hook
    const location = useLocation(); //위에 state값을 받는 React hook 여기서는 postId,postTitle,postContent를 받음

    const [loading, setLoading] = useState(true); //로딩
    const [open, setOpen] = useState(false); //모달창

    const [postTitle, setPostTitle] = useState(location.state.postTitle); //받아온 포스트 제목
    const [postContent, setPostContent] = useState(location.state.postTitle); //받아온 포스트 내용

    const [titleError, setTitleError] = useState(false); //포스트 제목 에러
    const [contentError, setContentError] = useState(false); //포스트 내용 에러


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
    //API가기전에 체크
    const handleSubmit = () => {
        setLoading(true); //로딩시작
        if (loading === true) {
            callAddPostAPI().then(() => {
                setOpen(false);
                navigate("/PostList");
            })
            return (<Box className="loading">
                <CircularProgress />
            </Box>)
        }
    }
    
    //게시글 수정 API  
    async function callAddPostAPI() {
        const formData = {
            id: location.state.postId,
            title: postTitle,
            content: postContent,
        };
        try {
            const response = await axios.patch(Constant.serviceURL + `/posts/${location.state.postId}`, formData, { withCredentials: true });
            console.log('서버 응답:', response.data);
        } catch (error) {
            console.error('오류 발생:', error);
            //  alert(error); // 사용자에게 오류 내용을 알립니다.
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
                    defaultValue={postTitle}
                    onChange={(e) => { setPostTitle(e.target.value) }}
                    error={titleError}
                    helperText={titleError && '제목을 제대로 입력해주세요 (25자 이내)'}
                />
                <TextField
                    placeholder="내용을 입력해주세요."
                    multiline
                    rows={20}
                    defaultValue={postContent}
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

