import React, { useState, useEffect } from 'react';
import { Container, Button, ButtonGroup, Box, IconButton } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate, Link } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import ModalComponent from '../../util/modal';
import Constant from '../../util/constant_variables';
import PostComment from './detail_post_comment';
import MyStorage from '../../util/redux_storage';

import axios from 'axios';

export default function DetailPostList() {
    const navigate = useNavigate(); //경로이동하는 React hook
    const location = useLocation(); //위에 state값을 받는 React hook 여기서는 postId를 받음

    const [loading, setLoading] = useState(true); //로딩
    const [commentLoading, setCommentLoading] = useState(true); //로딩
    const [open, setOpen] = useState(false); //모달창
    const [contents, setContents] = useState([]); //포스트 데이터 (commentList포함)

    const [commentList, setCommentList] = useState([]); //댓글 데이터 따로 배열을 놔둬야함
    const loginUserId = useSelector((state) => state.userId); //지금로그인한 userId

    //포스트 useEffect
    useEffect(() => {
        setLoading(true); //로딩시작
        callGetDetailPostAPI().then((response) => { //무사히 response를 받으면 아래 코드 실행
            setContents(response);
            setLoading(false); //로딩끝

        }); //특정 postId의 post리스트를 불러오는 API 실행
    }, []);
    //댓글 useEffect
    useEffect(() => {
        setCommentLoading(true); //로딩시작
        callGetDetailPostAPI().then((response) => { //무사히 response를 받으면 아래 코드 실행
            setCommentList(response.commentList);
            setCommentLoading(false); //로딩끝

        }); //특정 postId의 댓글리스트를 불러오는 API 실행
    }, []);

    //스크롤
    const scrollToAboutUs = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    //수정하는 페이지로 가는 함수 가면서 데이터도 전달하면서 감
    const postModify = () => {
        navigate(`/PostModify/${contents.postId}`, {
            state: {
                postId: contents.postId,
                postTitle: contents.postTitle,
                postContent: contents.postContent
            }
        });
    }
    //모달창
    const handleOpenClose = (e) => {
        e.preventDefault();
        setOpen(!open);
    };

    //게시글 삭제
    const handleSubmit = async () => {
        callDeletePostAPI().then((response) => { //callDeletePostAPI데이터가 return되면
            if (response) {
                setOpen(false);
                navigate("/PostList");
            }

        });
    };

    //게시글 삭제 API
    async function callDeletePostAPI() {
        try {
            const response = await axios.delete(Constant.serviceURL + `/posts/${location.state.postId}`, { withCredentials: true });
            //console.log('DeletePost response : ', response.data);
            return response.data;
        } catch (error) {
            console.error('오류 발생:', error);
        }
    };

    //게시글 불러오는 API
    async function callGetDetailPostAPI() {
        try {
            const response = await axios.get(Constant.serviceURL + `/dashBoards/${location.state.postId}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error('오류 발생:', error);
        }
    };

    return (
        <Container>
            {
                loading ? <Box className="loading">
                    <CircularProgress />
                </Box> : <>
                    <ModalComponent open={open} handleSubmit={handleSubmit} handleOpenClose={(e) => handleOpenClose(e)} message={"게시글 삭제 하시겠습니까?"} />

                    <Box
                        component="form"
                        className="component-column"
                        id="aboutUsSection"
                        noValidate
                        autoComplete="off"
                    >
                        <div>
                            <h3>{contents.postTitle}</h3>
                            <h5>{contents.postNickname}</h5>
                        </div>
                        <div>
                            <p>{contents.postContent}</p>
                        </div>
                    </Box>
                    <div className="component-footer">
                        {loginUserId === contents.postUserId ? (
                            <ButtonGroup variant="outlined" aria-label="outlined button group">
                                <Button onClick={postModify}>수정</Button>
                                <Button onClick={(e) => handleOpenClose(e)}>삭제</Button>
                                <Button onClick={() => { navigate("/PostList") }}>목록</Button>
                            </ButtonGroup>
                        ) : (
                            <ButtonGroup variant="outlined" aria-label="outlined button group">
                                <Button onClick={() => { navigate("/PostList") }}>목록</Button>
                            </ButtonGroup>
                        )}
                    </div>

                    <PostComment commentList={commentList} postId={location.state.postId} userId={location.state.userId} />

                    <div className="arrow" data-message="Scroll to Top">
                        <ArrowDropUpIcon color="primary" fontSize="large" onClick={scrollToAboutUs} />
                    </div>
                </>

            }

        </Container>
    );
};
