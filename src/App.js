import React from 'react';
import { createTheme, ThemeProvider } from "@mui/material";
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter, Outlet, Route, Routes, Navigate } from "react-router-dom";
import DetailPost from './pages/detail_post_list_page';
import PostList from './pages/list_page';
import Login from './pages/login_page';
import Signup from './pages/signup_page';
import Create from './pages/create_page';
import NonPage from './components/user/nonPage';
import ModifyPost from './pages/modify_page';
import MyStorage from './util/redux_storage';  // 이곳에서 createStore를 호출하여 스토어를 생성하였다고 가정하겠습니다.

const theme = createTheme({
  typography: {
    fontFamily: 'jua'
  }
});

//로그인이 안되어있을 경우 이 함수가 실행됨
const ConditionRoute = ({ element }) => {
  const userId = useSelector(state => state.userId);

  if (userId !== 0) { //로그인이 되어있다면
    return element;
  } else { //안되어있으면 로그인 창으로 감
    return <Navigate to='/' />;
  }
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={MyStorage}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/Create" element={<ConditionRoute element={<Create />} />} />
            <Route path="/PostList" element={<PostList />} />
            <Route path="/DetailPostList/:postId" element={<DetailPost />} />
            <Route path="/PostModify/:postId" element={<ModifyPost />} />
            <Route path="*" element={<NonPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
}

