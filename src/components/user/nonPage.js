import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, TextField, Container } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import nonPagelogo from '../../styles/image/nonPage.png';

export default function NonPage() {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };
    return (
        <Container sx={{ textAlign: 'center', mt: '10%' }}>
            <img src={nonPagelogo} width={'400px'} />
            <h1>잘못된 경로입니다.</h1>
            <Button endIcon={<UndoIcon />} onClick={goBack} variant="contained">뒤로가기</Button>
        </Container>
    );
}