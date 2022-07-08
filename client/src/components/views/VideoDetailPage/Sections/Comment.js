import React, { useState } from 'react'
import Axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comment(props) {

    const [commentValue, setcommentValue] = useState('');
    const user = useSelector(state => state.user);
    const videoId = props.postId;

    const handleClick = (e) => {
        setcommentValue(e.currentTarget.value);
    }
    const onSubmit = (e) => {
        e.preventDefault(); // 버튼 눌러도 새로고침 안되도록 하는 명령어
        
        const variable = {
            content: commentValue,
            writer: user.userData._id, // localStorage에서 가져와도 된다.
            postId: videoId
        }

        Axios.post('/api/comment/saveComment', variable)
        .then(response => {
            if (response.data.success) {
                console.log(response.data.result);
                setcommentValue("");
                props.refreshFunction(response.data.result);
            } else {
                alert('코멘트를 저장하지 못했습니다.');
            }
        })
    }
        
    
    return (
        <div>
            <br/>
            <p>Replies</p>
            <hr/>

            {/* Comment Lists */}
            {props.commentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment> {/* JSX문법에서는 div나 React.Fragment로 감싸줘야 함 */}
                        <SingleComment postId={videoId} comment={comment} refreshFunction={props.refreshFunction}/>
                        <ReplyComment commentLists={props.commentLists} parentCommentId={comment._id} postId={videoId} refreshFunction={props.refreshFunction}/>
                    </React.Fragment>
                )
            ))}

            {/* Root Comment Form */}
            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <textarea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder='코멘트를 작성해 주세요.'
                />
                <br/>
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</button>
            </form>

        </div>
    )
    
}

export default Comment