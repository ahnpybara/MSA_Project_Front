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
    }
  }

  render() {
    const theme = createTheme({
      typography: {
        fontFamily: 'jua'
      }
    })
    return (
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/Signup" element={<Signup />} />
            <Route path="/Create" element={<ConditionRoute path={'/'} originPath={"/Create"} />}>
              <Route exact path="/Create" element={<Create />} />
            </Route>
            <Route exact path="/PostList" element={<PostList />} />
            <Route exact path="/DetailPostList/:postId" element={<DetailPost />} />
            <Route path="/Modify" element={<ConditionRoute path={'/'} originPath={"/Modify"} />}>
              <Route exact path="/Modify" element={<Modify />} />
            </Route>

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

  }

  componentWillUnmount() {
    //console.log('라우터 언 마운트...');
    this.unsubscribe();
  }

  onStorageChange = () => {
    //console.log('라우터에서 리덕스에 변경된 값을 감지 = ', MyStorage.getState());
    this.setState({
      userId: parseInt(sessionStorage.getItem("userId")),
      nickname: sessionStorage.getItem("nickname")
    });
  }


  render() {
    //console.log('라우터에서 렌더',MyStorage.getState());
    //console.log("라우터에서 세션 값 = ",sessionStorage.getItem("userID"));

    if (this.state.userId != 0) {
      //console.log('라우터에서 로그인 성공 받았음',MyStorage.getState());
      return (<Outlet />);
    }
    //로그인을 통해서 들어옴(login페이지에서 visitLogin을 true로 해줌으로써 인식)
    // else if (MyStorage.getState().visitLogin == true && this.props.originPath == "/UserInfo") {
    //   MyStorage.dispatch({ type: "Exit" });
    //   //console.log("Exit 후 리덕스 값 =",MyStorage.getState())
    //   //console.log('라우터에 처음으로 들어롬');
    //   return (<></>);
    // }
    else {
      //console.log('라우터에서 거절되어 홈으로 이동함')
      return (<Navigate to={this.props.path} />);
    }
  }
}
