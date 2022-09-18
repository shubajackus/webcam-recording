import React, {useState, useEffect} from "react";
import { Space, Table, Modal, Typography } from 'antd';
import axios from "axios";
import "./styles.css"
import { BASE_API_URL } from "./utils/constants";

export default function Admin(){

  const [recordingsData, setRecordingsData] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");

  const { Title } = Typography;

  useEffect(()=>{
    getAllRecordings();
  },[])

  const getAllRecordings = async () => {
    const response = await axios.get(`${BASE_API_URL}/api/get_all_recordings`);
    setRecordingsData(response.data.data);
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (record) => {
    console.log("record", record);
    
    setIsModalOpen(true);
    setVideoUrl(record.url)
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setVideoUrl("");
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: 'Id',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Url',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={()=> showModal(record)}>Show Recording</a>
        </Space>
      ),
    },
  ];
  



  return (
    <div className="admin-main">
      <Title style={{margin: "30px"}} level={3}>View all recordings</Title>
      <div className="recordings-data">
        <Table columns={columns} dataSource={recordingsData} />
      </div>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={700}>
        {videoUrl}
        <video width="100%" controls>
          <source src={videoUrl} type="video/mp4"></source>
          Your browser does not support HTML video.
        </video>

      </Modal>
    </div>
  )
}