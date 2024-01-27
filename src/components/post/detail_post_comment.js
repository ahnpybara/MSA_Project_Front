import React, { Component } from 'react';
import { Button, Box, TextField, IconButton } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

import Constant from '../../util/constant_variables';
import WebServiceManager from '../../util/webservice_manager';

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
            commentList: this.props.commentList
        }
    }
    //댓글 추가
    commentSubmit = () => {
        const commentError = this.state.commentContext === '';

        if (!commentError) {
            const formData = {
                content: this.state.commentContext,
                nickname: this.state.loginUserNickname,
                postId: this.props.commentList.postId, //왜 undefined가 나오지?
                userId: this.state.loginUserId,
            };
            // 서버로 댓글 추가 요청을 보내는 API 호출 코드
            this.callAddCommentAPI(formData)
                .then((response) => {
                    console.log('addComment', response);
                    if (response.success > 0) {
                        this.setState((prevState) => ({
                            commentList: [...prevState.commentList, formData],
                            commentContext: '', // 댓글 입력 필드 초기화
                        }));
                    }
                })
                .catch((error) => {
                    console.error('addComment', error);
                    alert('댓글 추가에 실패했습니다.');
                });
        } else {
            alert('댓글을 입력해주세요!');
        }

    }

    //댓글 추가 하는 API ***URL 바꿔야함
    async callAddCommentAPI() {
        const formData = {
            content: this.state.commentContext,
            nickname: this.state.loginUserNickname,
            postId: this.state.commentList.postId,
            userId: this.state.loginUserId,
        };
        let manager = new WebServiceManager(Constant.serviceURL + "/comments/add", "post");
        manager.addFormData("data", formData); //넣을 데이터
        console.log(formData);
        let response = await manager.start();
        if (response.ok)
            return response.json();
    }

    render() {
        console.log(this.props.commentList);
        return (
            <>
                <div>
                    <p><ChatBubbleOutlineIcon fontSize="small" color="primary" /> : <span>{this.state.commentList.length}</span></p>
                </div>
                <Box
                    component="form"
                    className="component-row"
                    sx={{
                        '& .MuiTextField-root': { mr: 1 },
                        justifyContent: 'flex-start',
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <p>{this.state.loginUserNickname}</p>
                    <TextField
                        sx={{ ml: 1, flex: 1 }}
                        size="small"
                        placeholder='댓글 달기...'
                        onChange={(e) => this.setState({ commentContext: e.target.value })}
                        onKeyDown={(e) => (e.key === 'Enter' && this.commentSubmit)}
                    />
                    <Button variant="contained" endIcon={<CreateIcon />} onClick={this.commentSubmit}>
                        작성
                    </Button>
                </Box>
                {
                    this.state.commentList.map((commentData, i) =>
                        <CommentItem key={commentData.id} commentData={commentData} />
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

        const formData = { postId: this.state.postId, userId: this.state.loginUserId, content: updatedContent };
        let manager = new WebServiceManager(Constant.serviceURL + "/comments/modify", "post");
        // manager.addFormData("login", login); //삭제할 권한이 있는지 확인
        manager.addFormData("data", formData); //넣을 데이터
        let response = await manager.start();
        if (response.ok)
            return response.json();
    }

    //댓글 삭제 API 
    async callDeleteCommentAPI() {
        const formData = { postId: this.state.postId, userId: this.state.loginUserId };
        let manager = new WebServiceManager(Constant.serviceURL + "/comments/delete", "post");
        //manager.addFormData("login", login); //삭제할 권한이 있는지 확인
        manager.addFormData("data", formData); //넣을 데이터
        let response = await manager.start();
        if (response.ok)
            return response.json();
    }
    render() {
        const commentData = this.props.commentData;
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
                        : <p style={{ marginTop: '0px', marginLeft: '8px' }}>{commentData.content}</p>
                }

            </div>

        )
    }
}