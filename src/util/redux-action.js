
function reducer(action) {
    switch (action.type) {

      case "SET_SELECTED_POST_ID":
        // 선택된 postId 설정 액션 처리 로직
        sessionStorage.setItem('selectedPostId', action.data.postId); // 선택된 postId를 sessionStorage에 저장
        return {postId:action.data.postId};
        
      default:
        return {postId:action.data.postId};
    }
  }