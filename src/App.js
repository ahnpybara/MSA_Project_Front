import React, { Component } from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import './App.css';
import { BrowserRouter, Outlet, Route, Routes, Navigate } from "react-router-dom";
import DetailPost from './pages/detail_post_list_page';
import PostList from './pages/list_page';
import Login from './pages/login_page';
import Signup from './pages/signup_page';
import Create from './pages/create_page';
import NonPage from './components/user/nonPage';

import MyStorage from './util/redux_storage';
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    const theme = createTheme({
      typography: {
        fontFamily: 'jua'
      }
    });

    return (
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/Create" element={<ConditionRoute path={'/'} originPath={"/Create"} />}>
              <Route path="/Create" element={<Create />} />
            </Route>
            <Route path="/postList" element={<ConditionRoute path={'/'} originPath={"/postList"} />}>
              <Route path="/postList" element={<PostList />} />
            </Route>

            <Route path="/DetailPostList/:postId" element={<DetailPost />} />

            <Route path="*" element={<NonPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>

    );
  }

}

class ConditionRoute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: parseInt(sessionStorage.getItem("userId")),
      nickname: sessionStorage.getItem("nickname")
    }
  }

  componentDidMount() {
    this.unsubscribe = MyStorage.subscribe(this.onStorageChange); //리덕스에서 업데이트되면 알려줘, 여기 app.js만 씀, App.js에서도 값 업더ㅔ이트를 알아야함
    console.log("초기 상태", MyStorage.getState());
  }

  componentWillUnmount() {
    console.log('라우터 언 마운트...');
    this.unsubscribe();
  }

  onStorageChange = () => {
    console.log('라우터에서 리덕스에 변경된 값을 감지 = ', MyStorage.getState());
    this.setState({
      userId: parseInt(sessionStorage.getItem("userId")),
      nickname: sessionStorage.getItem("nickname")
    });
  }


  render() {
    console.log('라우터에서 렌더', MyStorage.getState());
    console.log("라우터에서 세션 값 = ", sessionStorage.getItem("userId"));

    if (MyStorage.getState().userId !== 0) {
      console.log('라우터에서 로그인 성공 받았음', MyStorage.getState());
      return (<Outlet />);
    }
    else {
      console.log('라우터에서 로그인 안됨', MyStorage.getState());
      return (<Navigate to={'/Login'} />);
    }
  }
}
