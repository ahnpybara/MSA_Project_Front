import React, { Component } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,IconButton } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Pagenation from "../../util/pagenation";
import Constant from '../../util/constant_variables';
import WebServiceManager from '../../util/webservice_manager';
import { Link } from 'react-router-dom';
export default class PostList extends Component {
    constructor(props) {
        super(props);
        this.origin = [];

        this.itemCountPerPage = 11; //한페이지당 보여질 리스트 갯수
        this.pageCountPerPage = 5;  //페이지는 5페이지로 제한

        this.state = {
            contents: [],
            detail: {}, //내가 선택한 contents정보를 가지고 있음
            //페이지 관련
            currentPage: 1,      // 현재 페이지 (setCurrentPage()에서 변경됨)
            offset: 0,            //현재페이지에서 시작할 item index
            month: 2,  // 필터링 할 개월

            detailVisible: false,
        }
    }
    componentDidMount() {
        this.callGetPostAPI().then((response) => {
            this.origin = response;
            this.setState({ contents: this.origin });
        })

    }
    //Pagenation에서 몇페이지의 내용을 볼지 선택 (페이지를 선택하면 현재의 페이지에따라 offset 변경)
    setCurrentPage = (page) => {
        let lastOffset = (page - 1) * this.itemCountPerPage;
        this.setState({ currentPage: page, offset: lastOffset });
    };


    //포스트 정보 불러오는 API ***URL 바꿔야함
    async callGetPostAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/Posts", "post");
        let response = await manager.start();
        if (response.ok)
            return response.json();
        
    }
    render() {
        return (
            <Container>

                <div style={{ height: '700px' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">No.</TableCell>
                                    <TableCell align="center">제목</TableCell>
                                    <TableCell align="center">작성자</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.state.contents.slice(this.state.offset, this.state.offset + this.itemCountPerPage).map((data, i) =>
                                        <PostSubList data={data} key={i} detailListener={(data) => this.detailListener(data)} />
                                    )
                                }
                            </TableBody>

                        </Table>

                    </TableContainer>
                </div>
                <div className="component-row" style={{ justifyContent: 'center' }}>
                    {this.state.contents.length > 0 && (
                        <Pagenation
                            color="primary"
                            itemCount={this.state.contents.length}
                            pageCountPerPage={this.pageCountPerPage}
                            itemCountPerPage={this.itemCountPerPage}
                            currentPage={this.state.currentPage}
                            clickListener={this.setCurrentPage}
                        />
                    )}
                </div>
                <div className="create">
                    <IconButton href="/create" color="primary" size="large">
                        <CreateIcon fontSize="large" />
                    </IconButton>
                </div>
            </Container>
        )
    }

}

class PostSubList extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        const data = this.props.data;
        return (
            <TableRow hover key={data.key}>
                <TableCell align="center" >{data.postId}</TableCell>
                <TableCell align="center"><Link className="cell-link" to={`/DetailPostList/${data.postId}`}>{data.postTitle}</Link><ChatBubbleOutlineIcon fontSize="small" color="primary" /><span>{data.commentList.length}</span></TableCell>
                <TableCell align="center">{data.postNickname}</TableCell>
            </TableRow>
        )
    }
}