import React, { Component } from 'react';
import { Button, Box, TextField, Container } from '@mui/material';

export default class NonPage extends Component {
    constructor(props) {
        super(props);
       
    }
    render() {
        return (
            <Container maxWidth="sm">
               <h1>잘못된 경로입니다</h1>
            </Container>
        );
    }

}