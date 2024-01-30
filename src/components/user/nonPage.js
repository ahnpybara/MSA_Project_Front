import React, { Component } from 'react';
import { Button, Box, TextField, Container } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import nonPagelogo from '../../styles/image/nonPage.png';
export default class NonPage extends Component {
    constructor(props) {
        super(props);

    }
    goBack = () => {
        window.history.back();
    };
    render() {
        return (
            <Container sx={{ textAlign: 'center',mt:'10%' }}>
                <img src={nonPagelogo} width={'400px'}/>
                <h1>잘못된 경로입니다.</h1>
                <Button endIcon={<UndoIcon />} onClick={this.goBack} variant="contained">뒤로가기</Button>
            </Container>
        );
    }

}