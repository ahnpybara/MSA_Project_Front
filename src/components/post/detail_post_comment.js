import React, { Component } from 'react';
import { Button, Box, TextField, IconButton, Typography } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Constant from '../../util/constant_variables';

import axios from 'axios';
import MyStorage from '../../util/redux_storage';
export default class PostComment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginUserNickname: MyStorage.getState().nickname,
            loginUserId: MyStorage.getState().userId,
            commentContext: '',
            commentError: false,
        }
    }
    //댓글 추가
    commentSubmit = () => {
        const commentError = this.state.commentContext === '';

        if (!commentError) {
            const formData = {
                content: this.state.commentContext,
                nickname: this.state.loginUserNickname,
                postId: this.props.postId,
                userId: this.state.loginUserId,
            };
            // 서버로 댓글 추가 요청을 보내는 API 호출 코드
            this.callAddCommentAPI(formData)
                .then((response) => {
                    console.log('addComment', response);
                    this.props.setCommentList((prevCommentList) => [
                        ...prevCommentList,response]);
                })
                .catch((error) => {
                    console.error('addComment', error);
                    this.setState({ commentError });
                });
        } else {
            this.setState({ commentError });
        }

    }

    //댓글 추가 하는 API
    async callAddCommentAPI() {
        //댓글 추가할때 보낼 데이터
        const formData = {
            content: this.state.commentContext,
            nickname: this.state.loginUserNickname,
            postId: this.props.postId,
            userId: this.state.loginUserId,
        };
        try {
            const response = await axios.post(Constant.serviceURL + '/comments', formData);
            console.log('서버 응답:', response.data);
            return response.data;
        } catch (error) {
            console.error('오류 발생:', error);
            alert(error); // 사용자에게 오류 내용을 알립니다.
        }
    }

    render() {
        const commentList = this.props.commentList;
        return (
            <>
                <div>
                    <p><ChatBubbleOutlineIcon fontSize="small" color="primary" /> : <span>{commentList.length}</span></p>
                </div>
                <Box
                    component="form"
                    className="component-row"
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        '& .MuiTextField-root': { mr: 1 },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <p sx={{ marginRight: '8px' }}>{this.state.loginUserNickname}</p>
                    <TextField
                        sx={{ ml: 1, flex: 1 }}
                        size="small"
                        placeholder='댓글 달기...'
                        error={this.state.commentError}
                        helperText={<span style={{ whiteSpace: 'nowrap' }}>{this.state.commentError && '댓글을 제대로 입력해주세요.'}</span>}
                        defaultValue={this.state.commentContext}
                        onChange={(e) => this.setState({ commentContext: e.target.value })}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                this.commentSubmit();
                            }
                        }}
                    />
                    <Button variant="contained" endIcon={<CreateIcon />} onClick={this.commentSubmit}>
                        작성
                    </Button>
                </Box>
                {
                    commentList.map((commentData, i) =>
                        <CommentItem key={commentData.id} index={i} commentData={commentData} />
                    )
                }
            </>
        )
    }

}

class CommentItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commentModalVisible: false,
            commentContext: '',
            loginUserId: MyStorage.getState().userId,
        }
    }
    //수정모달 on/off
    commentModify = () => {
        this.setState({ commentModalVisible: !this.state.commentModalVisible })
    }
    //수정한 텍스트 보내기
    commentSubmit = () => {
        const updatedContent = this.state.commentContext;
        this.callMoidfyCommentAPI(updatedContent);
        this.setState({ commentModalVisible: !this.state.commentModalVisible });
    }
    //댓글 삭제
    commentDelete = () => {
        if (window.confirm("댓글을 삭제하시겠습니까?")) {
            this.callDeleteCommentAPI();
        }
    }
    //댓글 수정 API 
    async callMoidfyCommentAPI(updatedContent) {
        //댓글 수정할때 보낼 데이터
        const formData = {
            postId: this.state.postId,
            userId: this.state.loginUserId,
            content: updatedContent
        };
        try {
            const response = await axios.patch(Constant.serviceURL + `/comments/${this.props.commentData}`, formData);
            console.log('서버 응답:', response.data);
        } catch (error) {
            console.error('오류 발생:', error);
            alert(error); // 사용자에게 오류 내용을 알립니다.
        }
    }

    //댓글 삭제 API 
    async callDeleteCommentAPI() {
        //댓글 삭제할때 보낼 데이터
        const formData = {
            content: this.props.content,
            postId: this.state.postId,
            nickname: this.props.nickname,
        };
        try {
            const response = await axios.delete(Constant.serviceURL + `/comments/${this.props.commentData.id}`);
            console.log('response : ', response.data);
            return response.data;
        } catch (error) {
            console.error('오류 발생:', error);
        }
    }
    render() {
        const commentData = this.props.commentData;
        console.log(this.props.commentData)
        return (
            <div>
                <div className="component-row">

                    <h5 style={{ marginRight: '8px' }}>{commentData.nickname}</h5>
                    {
                        this.state.loginUserId === commentData.userId && <>
                            <IconButton aria-label="edit" onClick={this.commentModify}>
                                <EditIcon fontSize='small' />
                            </IconButton>
                            <IconButton aria-label="delete" onClick={this.commentDelete}>
                                <DeleteIcon fontSize='small' />
                            </IconButton>
                        </>
                    }
                </div>
                {
                    this.state.commentModalVisible === true ?
                        <Box
                            component="form"
                            className="component-row"
                            sx={{
                                '& .MuiTextField-root': { mr: 1 },
                                justifyContent: 'flex-start', // 기본값으로 설정할 justifyContent 추가
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField
                                id="outlined-required"
                                size="small"
                                defaultValue={commentData.content}
                                onChange={(e) => this.setState({ commentContext: e.target.value })}
                            />
                            <Button variant="contained" endIcon={<CreateIcon />} onClick={this.commentSubmit}>
                                작성
                            </Button>
                        </Box>
                        : <p style={{ marginTop: '0px', marginLeft: '8px' }}> {commentData.content}</p>
                }

            </div>

        )
    }
}