import React, { useEffect, useState } from 'react'
import { FaCode, FaPray } from "react-icons/fa";
import { Card, Icon, Avatar, Col, Typography, Row } from 'antd';
import moment from 'moment';
import Axios from 'axios';
const { Title } = Typography;
const { Meta } = Card;

function SubscriptionPage() {
    const [Video, setVideo] = useState([]);

    useEffect(() => {

        const subscriptionVariables = {
            userFrom: localStorage.getItem('userId')
        }

        Axios.post('/api/video/getSubscriptionVideos', subscriptionVariables) // 조건을 걸고 가져와야되서 프로퍼티 추가
        .then(response => {
            if (response.data.success) {
                console.log(response.data);
                setVideo(response.data.videos);
            } else {
                alert('비디오 가져오기를 실패 했습니다.');
            }
        })
    }, [])

    const renderCards = Video.map((video, index) => {
        let minutes = Math.floor(video.duration / 60);
        let seconds = Math.floor((video.duration - minutes * 60));
        
        return (
        <Col key={index} lg={6} md={8} xs={24}> {/* window 사이즈가 가장 클 때에는 Col 한개의 사이즈가 6, 중간일 때는 8, 가장 작을 때는 24 */}
            <a href={`/video/${video._id}`}>
                <div style={{ position: 'relative' }}>
                    <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} alt='thumbnail'/>
                    <div className='duration'>
                        <span>{minutes} : {seconds}</span>
                    </div>
                </div>
            </a>
            <br/>
            <Meta
                avatar={
                    <Avatar src={video.writer.image}/>
                }
                title={video.title}
                description=''
            />
            <span>{video.writer.name}</span> <br/>
            <span style={{ marginLeft: '3rem' }}>{video.views} views</span> - <span>{moment(video.createdAt).format("MM")}</span>
        </Col>
        )
    })

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2}>Recommended</Title>
            <hr/>
            {/* 1개의 Row가 24사이즈, 1개의 Row에 4개의 Column */}
            <Row gutter={[32, 16]}>
                {renderCards}
            </Row>
        </div>
    )
}

export default SubscriptionPage