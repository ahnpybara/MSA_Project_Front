import React, { useState, useEffect } from 'react';
import { Container, Button, ButtonGroup, Box, IconButton } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Navigate, useLocation } from "react-router-dom";

import ModalComponent from '../../util/modal';
import Constant from '../../util/constant_variables';
import PostComment from './detail_post_comment';
import ModifyComponent from './modify';
import MyStorage from '../../util/redux_storage';

import axios from 'axios';

const DetailPostList = () => {
    const [open, setOpen] = useState(false);
    const [contents, setContents] = useState([]);
    const [commentList, setCommentList] = useState([]);
    const [loginUserNickname, setLoginUserNickname] = useState(MyStorage.getState().nickname);
    const [loginUserId, setLoginUserId] = useState(MyStorage.getState().userId);
    const [modifyVisible, setModifyVisible] = useState(false);

    const location = useLocation();
    const postId = location.state.postId;
    const userId = contents.postUserId;
    useEffect(() => {
        callGetDetailPostAPI().then((response) => {
            setContents(response);
            setCommentList(response.commentList);
            console.log("response.commentList",response.commentList)
        });
    }, []);

    const scrollToAboutUs = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const postHistory = () => {
        window.location.href = "/";
    };

    const postModify = () => {
        setModifyVisible(!modifyVisible);
    };

    const handleOpenClose = (e) => {
        e.preventDefault();
        setOpen(!open);
    };

    const handleSubmit = async () => {
        callDeletePostAPI().then((response) => {
            setOpen(false);
            window.location.href = "/";
        });
    };

    const callDeletePostAPI = async () => {
        try {
            const response = await axios.delete(Constant.serviceURL + `/posts/${postId}`);
            console.log('DeletePost response : ', response.data);
            return response.data;
        } catch (error) {
            console.error('오류 발생:', error);
        }
    };
    const callGetDetailPostAPI = async () => {
        try {
            const response = await axios.get(Constant.serviceURL + `/dashBoards/${postId}`, { withCredentials: true });
            console.log('GetDetailPost response : ', response.data);
            return response.data;
        } catch (error) {
            console.error('오류 발생:', error);
        }
    };


    return (
        <Container>
            <ModalComponent open={open} handleSubmit={handleSubmit} handleOpenClose={handleOpenClose} message={"게시글 삭제 하시겠습니까?"} />
            {modifyVisible === true ? (
                <ModifyComponent data={contents} postModify={postModify} />
            ) : (
                <>
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
                    {loginUserId === contents.postUserId ? (
                        <div className="component-footer">
                            <ButtonGroup variant="outlined" aria-label="outlined button group">
                                <Button onClick={postModify}>수정</Button>
                                <Button onClick={handleOpenClose}>삭제</Button>
                                <Button onClick={postHistory}>목록</Button>
                            </ButtonGroup>
                        </div>
                    ) : (
                        <div className="component-footer">
                            <ButtonGroup variant="outlined" aria-label="outlined button group">
                                <Button onClick={postHistory}>목록</Button>
                            </ButtonGroup>
                        </div>
                    )}
                    <PostComment key={commentList.id} postId={postId} userId={userId} commentList={commentList} setCommentList={setCommentList}/>
                    <div className="arrow" data-message="Scroll to Top">
                        <ArrowDropUpIcon color="primary" fontSize="large" onClick={scrollToAboutUs} />
                    </div>
                </>
            )}
        </Container>
    );
};

export default DetailPostList;