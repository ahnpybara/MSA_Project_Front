import React, { Component } from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import './App.css';
import { BrowserRouter, Outlet, Route, Routes, Navigate } from "react-router-dom";
import DetailPost from './pages/detail_post_list_page';
import PostList from './pages/list_page';
import Login from './pages/login_page';
import Signup from './pages/signup_page';
import Create from './pages/create_page';
import Modify from './pages/modify_page';
import NonPage from './components/user/nonPage';

import MyStorage from './util/redux_storage';
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: parseInt(sessionStorage.getItem("userId")),
      nickname: sessionStorage.getItem("nickname"),

    }
  }
  componentDidMount() {
    //리덕스에서 업데이트되면 알려줘, 여기 app.js만 씀, App.js에서도 값 업더ㅔ이트를 알아야함
    this.unsubscribe = MyStorage.subscribe(this.onStorageChange);
  }
  componentWillUnmount() {
    //라우터 언 마운트...
    this.unsubscribe();
  }
  onStorageChange = () => {
    //라우터에서 리덕스에 변경된 값을 감지
    this.setState({
      userId: parseInt(sessionStorage.getItem("userId")),
      nickname: sessionStorage.getItem("nickname")
    });
  }
  render() {
    const theme = createTheme({
      typography:{
        fontFamily:'jua'
      }
    })
    return (
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/Signup" element={<Signup />} />
            <Route exact path="/Create" element={<Create />} />
            <Route exact path="/PostList" element={<PostList />} />
            <Route exact path="/DetailPostList/:postId" element={<DetailPost />} />
            <Route exact path="/Modify" element={<Modify />} />
            <Route path="*" element={<NonPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>

    );
  }
}