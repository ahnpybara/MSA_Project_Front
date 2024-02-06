import React, { useEffect, useState } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Box } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import CircularProgress from '@mui/material/CircularProgress';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Pagenation from "../../util/pagenation";
import Constant from '../../util/constant_variables';
import MyStorage from '../../util/redux_storage';
import { Link } from 'react-router-dom';
import axios from 'axios';


export default function PostList() {

    const [loading, setLoading] = useState(true); //로딩
    const [contents, setContents] = useState([]); //백에서 받아온 데이터를 배열로
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 (setCurrentPage()에서 변경됨)
    const [offset, setOffset] = useState(0); //현재페이지에서 시작할 item index

    const itemCountPerPage = 10;
    const pageCountPerPage = 5;

    //백에서 데이터 들고오는 useEffect
    useEffect(() => {
        setLoading(true); //로딩시작
        callGetPostAPI().then((response) => {
            setContents(response);
            setLoading(false); //로딩끝
        }); //백에서 데이터 호출
    }, []);

    //페이지네이션 함수
    const setCurrentPageFunc = (page) => {
        let lastOffset = (page - 1) * itemCountPerPage;
        setCurrentPage(page);
        setOffset(lastOffset);
    };

    //포스트 목록 들고오는 API
    async function callGetPostAPI() {
        try {
            const response = await axios.get(Constant.serviceURL + '/dashBoards', { withCredentials: true });
            return response.data._embedded.dashBoards;
        } catch (error) {
            console.error('오류 발생:', error);
            setLoading(false); //로딩끝
        }
    };
    return (
        <Container>
            {
                loading ? <Box className="loading">
                    <CircularProgress />
                </Box> : <>
                    <div style={{ height: '680px' }}>
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
                                    {contents.length === 0 ? (
                                        <TableRow hover key={1}>
                                            <TableCell align="center" colSpan={3}>텅~ 비었습니다</TableCell>
                                        </TableRow>
                                    ) : (
                                        <>
                                            {contents.map((data, i) => (
                                                i >= offset && i < offset + itemCountPerPage &&
                                                <PostSubList data={data} key={data.postId} index={i} />
                                            ))}
                                            {/* {contents.slice(offset, offset + itemCountPerPage).map((data, i) => (
                                                <PostSubList data={data} key={data.postId} index={i} />
                                            ))} */}
                                        </>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    <div className="component-row" style={{ justifyContent: 'center' }}>
                        {contents.length > 0 && (
                            <Pagenation
                                color="primary"
                                itemCount={contents.length}
                                pageCountPerPage={pageCountPerPage}
                                itemCountPerPage={itemCountPerPage}
                                currentPage={currentPage}
                                clickListener={setCurrentPageFunc}
                            />
                        )}
                    </div>
                    <div className="create" data-message="New Post">
                        <IconButton href="/Create" color="primary" size="large">
                            <CreateIcon fontSize="large" />
                        </IconButton>
                    </div>
                </>
            }
        </Container>
    );
};

const PostSubList = ({ data, index }) => {
    return (
        <TableRow hover>
            <TableCell align="center">{index + 1}</TableCell>
            <TableCell align="center">
                <Link className="cell-link" to={`/DetailPostList/${data.postId}`} state={{ postId: data.postId, userId: data.postUserId }}>
                    {data.postTitle}
                    {data.commentList.length !== 0 && <>
                        <ChatBubbleOutlineIcon fontSize="small" color="primary" /><span>{data.commentList.length}</span>
                    </>
                    }
                </Link>
            </TableCell>
            <TableCell align="center">{data.postNickname}</TableCell>
        </TableRow>
    );
};