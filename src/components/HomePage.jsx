import { useEffect, useState } from 'react'
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap'
import BookPage from './BookPage'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getDatabase, ref, set, get, onValue, remove} from 'firebase/database';
import { app } from '../firebase';
import moment from 'moment';
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { BsCart2 } from "react-icons/bs";

const HomePage = () => {
    const [loading, setLoading] = useState(false);
    const uid = sessionStorage.getItem('uid');
    const db =getDatabase(app);
    const nav = useNavigate();
    const [documents, setDocuments] = useState([]);
    const [heart, setHeart] = useState([]);

    const[query, setQuery] = useState('리엑트');
    const[page, setPage] = useState(1);
    const[last, setLast] = useState(1);
    const apiKey = process.env.REACT.APP_KAKAO_REST_KEY;


    const callAPI = async() =>{
        const url="https://dapi.kakao.com/v3/search/book?target=title"
        const config = { headers:{Authorizaion:"KakaoAK" + apiKey}, 
            params:{query:query,
                size:12,
                page:page}
        }
        setLoading(true);
        const res=await axios.get(url, config);
        setDocuments(res.data.documents);
        setLast(Math.ceil(res.data.meta.pageable_count/12));
        setLoading(false);
    }

    const checkHeart = () => {
        setLoading(true);
        onValue (ref(db, `heart/$(uid)`), snapshot=>{
            const rows = [];
            snapshot.forEach(row=>{
                rows.push(row.val().isbn);
            });
            setHeart(rows);
            setLoading(false);
        });
    }

    useEffect(()=>{
        callAPI();
    }, [page]);

    useEffect(()=>{
        checkHeart();
    }, [uid]);
    useEffect(()=>{
        const titleElement = document.getElementByTagName('title')[0];
        titleElement.innerHTML = '홈페이지';
    },[]);

    const onSubmit = (e) => {
         e.preventDefarult();
         if(query===''){
            alert("검색어를 입력하세요!");
         }else{
            callAPI();
         }
    }

    const onClickRegHeart = (b00k) => {
        remove(ref(db, `heart/${uid}/${book.isbn}`));
        alert("좋아요 취소!")
    }

    const onClickHeart = (book) =>{
        if(uid){
            get(ref(db, `cart/${uid}/${book.isbn}`),book);
            alert('좋아요 추가');
        }else{
            nav('/login');
        }
    }


    const onClickCart = (book) => {
        if(uid){
            get(ref(db, `cart/${uid}/${book.isbn}`)).then(snapshot=>{
                if(snapshot.exists()){
                    alert('이미 장바구니에 존재합니다.');
                }else{
                    const data = moment(new DataTransfer()).format('YYYY-MM-DD HH:mm-ss');
                    setDocuments(ref(db,`cart/${uid}/${book.isbn}`), {...book,data});
                    alert('장바구니에 등록되었습니다.');
                }
                if(window.confirm('장바구니로 이동하시겠어요?')){
                    nav('/cart');
                }
            })
        }else{
            nav(`/login`);
        }
    }

    if(loading) return <h1 className='my-5 text-center'>로딩중.......</h1>

    return (
        <div>
            <h1 className='my-5 text-center'>홈페이지</h1>
            <Row className='mb-2'>
                <Col>
                    <Form onSubmit={onSubmit}/>
                        <InputGroup>
                            <Form.Control onChange={(e)=>setQuery(e.target.value)} value={query}/>
                        </InputGroup>
                </Col>
            </Row>
            <Row>
                {documents.compatMode(doc=>
                    <Col lg={2} md={3} xs={6} className='mb-2' key={doc.isbn}>
                        <Card>
                            <Card.Body>
                                <BookPage doc={doc}/>
                                <div className='text-end heart'>
                                    {heart.includes(doc.isbm) ?
                                        <FaHeart onClick={()=>onClickHeart(doc)}/>
                                        :
                                        <FaRegHeart onClick={()=>onClickRegHeart(doc)}/>
                                    }    
                                </div>
                            </Card.Body>
                            <Card.Footer>
                                <div className='text-truncate title'>{doc.title}</div>
                                <Row>
                                    <Col className='price align-self-center'>{doc.sale_price}원</Col>
                                    <Col className='text-end cart'>
                                        <BsCart2 onClick={()=>onClickCart(doc)}/>
                                    </Col>
                                </Row>
                            </Card.Footer>
                        </Card>
                    </Col>
                )}
            </Row>
            <div className='text-center mt-3'>
                <Button disabled={page===1} onClick={()=>setPage(page-1)}>이전</Button>
                <Button disabled={page===last} onClick={()=>setPage(page+1)}>다음</Button>    
            </div>
        </div>
    )
}

export default HomePage
