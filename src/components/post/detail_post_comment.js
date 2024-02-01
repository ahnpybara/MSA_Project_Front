import React, { Component } from 'react';
import { Button, Box, TextField, IconButton, Typography } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Constant from '../../util/constant_variables';
import ModalComponent from '../../util/modal';
import axios from 'axios';
import MyStorage from '../../util/redux_storage';
export default class PostComment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            loginUserNickname: MyStorage.getState().nickname,
            loginUserId: MyStorage.getState().userId,
            commentContext: '',
            commentError: false,
            commentList: this.props.commentList
        }
    }
    //댓글 추가
    commentSubmit = (e) => {
        e.preventDefault();
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
                    window.location.reload(); // 새로고침
                })
                .catch((error) => {
                    this.setState({ commentError });
                });
        } else {
            this.setState({ commentError });
        }
    }
    //댓글 수정
    commentModify = (id) => {
        console.log("!!!!!!!!!!!!!!!!!!!!!!!this.props.id = ", id);
        this.callModifyCommentAPI(id).then((response) => {
            console.log(response);
            window.location.reload(); // 새로고침
        })
    }
    //댓글 삭제
    commentDelete = (id) => {
        console.log("!!!!!!!!!!!!!!!!!!!!!!!this.props.id = ", id);
        this.callDeleteCommentAPI(id).then((response) => {
            console.log(response);
            window.location.reload(); // 새로고침
        })
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
            const response = await axios.post(Constant.serviceURL + '/comments', formData, { withCredentials: true });
            console.log('서버 응답:', response.data);
            return response.data;
        } catch (error) {
            console.error('오류 발생:', error);
            throw error;
        }
    }

    //댓글 삭제 API 
    async callDeleteCommentAPI(id) {
        try {
            const response = await axios.delete(Constant.serviceURL + `/comments/${id}`, { withCredentials: true });
            console.log('response : ', response);
            return response;
        } catch (error) {
            console.error('오류 발생:', error);
        }
    }
    //댓글 수정 API 
    async callModifyCommentAPI(id) {
        try {
            const response = await axios.patch(Constant.serviceURL + `/comments/${id}`, { withCredentials: true });
            console.log('response : ', response);
            return response;
        } catch (error) {
            console.error('오류 발생:', error);
        }
    }

    render() {
        const commentList = this.props.commentList;

        return (
            <>

                <div>
                    <p><ChatBubbleOutlineIcon fontSize="small" color="primary" /> : <span>{commentList.length}</span></p>
                </div>
                {
                    this.state.loginUserId !== 0 && <Box
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

                        <p className={this.props.userId === this.state.loginUserId && "special-color"} style={{ marginRight: '8px' }}>{this.state.loginUserNickname}</p>
                        <TextField
                            sx={{ ml: 1, flex: 1 }}
                            size="small"
                            placeholder='댓글 달기...'
                            error={this.state.commentError}
                            helperText={<span style={{ whiteSpace: 'nowrap' }}>{this.state.commentError && '댓글을 제대로 입력해주세요.'}</span>}
                            defaultValue={this.state.commentContext}
                            onChange={(e) => this.setState({ commentContext: e.target.value })}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') { this.commentSubmit(e) }
                            }}
                        />
                        <Button variant="contained" endIcon={<CreateIcon />} onClick={this.commentSubmit}>
                            작성
                        </Button>
                    </Box>
                }

                {
                    commentList.map((commentData, i) =>
                        <CommentItem
                            key={commentData.id}
                            index={i}
                            id={commentData.id}
                            commentDelete={this.commentDelete} // 수정된 부분
                            commentModify={this.commentModify}
                            commentData={commentData}
                            loginUserId={this.state.loginUserId}
                            userId={this.props.userId} />
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
            commentContext: '',
            loginUserId: MyStorage.getState().userId,
            commentModalVisible: false,
        }
    }
    componentDidMount() {
    }
    //댓글 수정
    commentModify = () => {
        this.setState({ commentModalVisible: !this.state.commentModalVisible });
    }
    commentSubmit = (id) => {
        this.props.commentModify(this.props.commentData.id); // 수정
        console.log(id);
    }
    //댓글 삭제
    commentDelete = (id) => {
        this.props.commentDelete(this.props.commentData.id); // 삭제
        console.log(id);
    }

    render() {
        const commentData = this.props.commentData;
        return (
            <div key={this.props.commentData.id}>
                <div className="component-row">
                    <h5 className={commentData.userId === this.props.userId && "special-color"} style={{ marginRight: '8px' }}>{commentData.nickname}</h5>
                    {
                        this.state.loginUserId === commentData.userId && <>
                            <IconButton aria-label="modify" onClick={this.commentModify}>
                                <EditIcon fontSize='small' />
                            </IconButton>
                            <IconButton aria-label="delete" onClick={(e) => this.commentDelete(e.id)}>
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
                            <Button variant="contained" endIcon={<CreateIcon />} onClick={(e) => this.commentSubmit(e.id)}>
                                작성
                            </Button>
                        </Box>
                        : <p style={{ marginTop: '0px', marginLeft: '8px' }}> {commentData.content}</p>
                }

            </div>

        )
    }
}