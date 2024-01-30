import React, { Component } from 'react';
import { Container, Button, ButtonGroup, Box } from '@mui/material';

import Constant from '../../util/constant_variables';
import WebServiceManager from '../../util/webservice_manager';
import PostComment from './detail_post_comment';
import ModifyComponent from './modify';

import MyStorage from '../../util/redux_storage';
export default class DetailPostList extends Component {
    constructor(props) {
        super(props);
        this.origin = [];
        this.state = {
            contents: [], //post정보
            commentList: [], //comment 정보
            loginUserNickname: MyStorage.getState().nickname,
            loginUserId: 1, //MyStorage.getState().userId,
            modifyVisible: false,
        }
    }
    componentDidMount() {
        this.callGetDetailPostAPI().then((response) => {
            this.origin = response;
            this.setState({ contents: this.origin, commentList: this.origin.commentList });
        })
    }
    postHistory = () => {
        window.location.href = "/PostList";
    }
    //게시글 수정 함수
    postModify = () => {
        if (window.confirm("수정하시겠습니까?")) {
            this.setState({ modifyVisible: true }) //수정을 누르면 수정 컴포넌트가 뜸
        }
    }
    //게시글 삭제 함수
    postDelete = () => {
        if (window.confirm("게시글을 삭제하시겠습니까?")) {
            //게시글 삭제 로직
            this.callDeletePostAPI().then((response) => {
                if (response.success > 0) {
                    alert('삭제 완료되었습니다!');
                }
            })

        }
    }
    //게시글 삭제 API ***데이터 수정 필요
    async callDeletePostAPI() {
        const formData = {
            userId: this.props.data.userId,
            postId: this.props.data.postId
        };

        let manager = new WebServiceManager(Constant.serviceURL + "/posts/delete", "post");
        ///manager.addFormData("login", login); //삭제할 권한이 있는지 확인
        manager.addFormData("data", formData); //넣을 데이터
        let response = await manager.start();
        if (response.ok)
            return response.json();
    }

    //디테일 포스트 API
    async callGetDetailPostAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + `/posts/${this.state.contents.postId}`, "post");
        let response = await manager.start();
        if (response.ok)
            return response.json();
    }
    render() {
        return (
            <Container>
                {
                    this.state.modifyVisible === true ? <ModifyComponent data={this.state.contents}/> :
                        <>
                            <Box
                                component="form"
                                className="component-column"
                                noValidate
                                autoComplete="off"
                            >
                                <div>
                                    <h3>{this.state.contents.postTitle}</h3>
                                    <h5>{this.state.contents.postNickname}</h5>
                                </div>
                                <div>
                                    <p>{this.state.contents.postContent}</p>
                                </div>

                            </Box>
                            {
                                this.state.loginUserId === this.state.contents.postId ?
                                    <div className="component-footer">
                                        <ButtonGroup variant="outlined" aria-label="outlined button group">
                                            <Button onClick={this.postModify}>수정</Button>
                                            <Button onClick={this.postDelete}>삭제</Button>
                                            <Button onClick={this.postHistory}>목록</Button>
                                        </ButtonGroup>
                                    </div> : <div className="component-footer">
                                        <ButtonGroup variant="outlined" aria-label="outlined button group">
                                            <Button onClick={this.postHistory}>목록</Button>
                                        </ButtonGroup>
                                    </div>
                            }


                            <PostComment commentList={this.state.commentList} />
                        </>
                }

            </Container>
        )
    }

}