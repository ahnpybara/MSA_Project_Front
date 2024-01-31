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
            <Route path="/" element={<PostList />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/Create" element={<ConditionRoute path={'/'} originPath={"/Create"} />}>
              <Route path="/Create" element={<Create />} />
            </Route>
            <Route path="/Login" element={<Login />} />
            <Route path="/DetailPostList/:postId" element={<DetailPost />} />

            <Route path="*" element={<NonPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>

    );
  }
}