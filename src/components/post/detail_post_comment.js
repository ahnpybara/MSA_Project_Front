import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { Button, Box, TextField, IconButton, Typography } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from '@mui/icons-material/Edit';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Constant from '../../util/constant_variables';
import ModalComponent from '../../util/modal';
import axios from 'axios';
import { useSelector } from 'react-redux';

const PostComment = ({ commentList, postId, userId }) => {
    const commentItemRef = useRef();
    const loginUserNickname = useSelector(state => state.nickname);
    const loginUserId = useSelector(state => state.userId);

    const [open, setOpen] = useState(false);
    const [commentContext, setCommentContext] = useState('');
    const [commentError, setCommentError] = useState(false);
    const [commentData, setCommentData] = useState(commentList);

    useEffect(() => {
        setCommentData(commentList);
    }, [commentList]);

    //API가기 전 체크
    const commentSubmit = (e) => {
        e.preventDefault();
        const commentError = commentContext === '';
        if (!commentError) {
            callAddCommentAPI()
                .then((response) => {
                    window.location.reload(); // 새로고침
                })
                .catch((error) => {
                    setCommentError(true);
                });
        } else {
            setCommentError(true);
        }
    }
    //댓글 삭제
    const commentDelete = (id) => {
        callDeleteCommentAPI(id).then((response) => {
            console.log(response);
            window.location.reload(); // 새로고침
        })
    }
    //댓글 수정
    const commentModify = (id) => {
        callModifyCommentAPI(id).then((response) => {
            console.log(response);
            window.location.reload(); // 새로고침
        })
    }
    //댓글 삭제 API 
    async function callDeleteCommentAPI(id) {
        try {
            const response = await axios.delete(Constant.serviceURL + `/comments/${id}`, { withCredentials: true });
            console.log('response : ', response);
            return response;
        } catch (error) {
            console.error('오류 발생:', error);
        }
    }
    //댓글 수정 API 
    async function callModifyCommentAPI(id) {
        try {
            const response = await axios.patch(Constant.serviceURL + `/comments/${id}`, { withCredentials: true });
            console.log('response : ', response);
            return response;
        } catch (error) {
            console.error('오류 발생:', error);
        }
    }
    //댓글 추가 API
    async function callAddCommentAPI() {
        //보낼 데이터
        const formData = {
            content: commentContext,
            nickname: loginUserNickname,
            postId: postId,
            userId: loginUserId,
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

    return (
        <>
            <div>
                <p><ChatBubbleOutlineIcon fontSize="small" color="primary" /> : <span>{commentData.length}</span></p>
            </div>
            {
                loginUserId !== 0 && <Box
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

                    <p className={userId === loginUserId && "special-color"} style={{ marginRight: '8px' }}>{loginUserNickname}</p>
                    <TextField
                        sx={{ ml: 1, flex: 1 }}
                        size="small"
                        placeholder='댓글 달기...'
                        error={commentError}
                        helperText={<span style={{ whiteSpace: 'nowrap' }}>{commentError && '댓글을 제대로 입력해주세요.'}</span>}
                        defaultValue={commentContext}
                        onChange={(e) => setCommentContext(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') { commentSubmit(e) }
                        }}
                    />
                    <Button variant="contained" endIcon={<CreateIcon />} onClick={commentSubmit}>
                        작성
                    </Button>
                </Box>
            }
            {
                commentData.map((commentData, i) =>
                    <CommentItem
                        key={commentData.id}
                        ref={commentItemRef}
                        index={i}
                        commentData={commentData}
                        userId={userId}
                        commentModify={commentModify}
                        commentDelete={commentDelete} />
                )
            }
        </>
    )
}

const CommentItem = forwardRef(({ commentData, userId, commentModify, commentDelete }, ref) => {
    const [commentContext, setCommentContext] = useState('');
    const loginUserId = useSelector(state => state.userId);
    const [commentModalVisible, setCommentModalVisible] = useState(false);

    const handleModify = () => {
        setCommentModalVisible(!commentModalVisible);
    }

    useImperativeHandle(ref, () => ({
        commentModify: commentModify,
        commentDelete: commentDelete
    }));

    return (
        <div key={commentData.id}>
            <div className="component-row">
                <h5 className={userId === commentData.userId && "special-color"} style={{ marginRight: '8px' }}>{commentData.nickname}</h5>
                {
                    loginUserId === commentData.userId && <>
                        <IconButton aria-label="modify" onClick={handleModify}>
                            <EditIcon fontSize='small' />
                        </IconButton>
                        <IconButton aria-label="delete" onClick={() => commentDelete(commentData.id)}>
                            <DeleteIcon fontSize='small' />
                        </IconButton>
                    </>
                }
            </div>
            {
                commentModalVisible === true ?
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
                            onChange={(e) => setCommentContext(e.target.value)}
                        />
                        <Button variant="contained" endIcon={<CreateIcon />} onClick={handleModify}>
                            작성
                        </Button>
                    </Box>
                    : <p style={{ marginTop: '0px', marginLeft: '8px' }}> {commentData.content}</p>
            }
        </div>
    );
});
export default PostComment;