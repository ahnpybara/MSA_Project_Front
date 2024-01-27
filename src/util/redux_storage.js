import {legacy_createStore as createStore} from "redux";

const loginState={userId:0,nickname:""};

function reducer (state=loginState, action)  {
    //console.log('리덕스에서의 값들 = ',action.data);
    switch(action.type) {
        case "Login":
            sessionStorage.setItem('userId',action.data.userId);
            sessionStorage.setItem('nickname',action.data.nickname);
            return {...state,userId:action.data.userId,nickname:action.data.nickname};
        case "Logout" :
            sessionStorage.setItem('userId',0);
            sessionStorage.setItem('nickname','');
            return {...state, userId:0,nickname:''};
        default:
            return {...state, state};
    }
};

export default createStore(reducer);