import React, {useState, useEffect} from 'react'
import Header from '../components/header/Header'
import { Container, Row, Col, Card} from 'react-bootstrap'
import {Line, Bar} from 'react-chartjs-2'
import axios from 'axios'
import {BASE_URL, config} from '../globals/globals' 
import { AiOutlineDollarCircle, AiOutlineStock, AiOutlineFall, AiOutlineThunderbolt } from "react-icons/ai";
import './dashboard.css'
import Footer from '../components/footer/Footer'
export default function Dashboard() {
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(false)
    const [chartData, setChartData] = useState([])
    const fetchOrders = async () => {
        let orderCost = []
        let orderDate = []
        await axios.get(`${BASE_URL}/api/all/orders`, {
            headers: config
        })
        .then(res=>{

            for(const dataObj of res.data){
                const date = new Date(dataObj.date_created)
                orderCost.push(parseInt(dataObj.price))
                orderDate.push((date.getMonth()+1)+"/"+ date.getDate())
            }
            setChartData({
                labels: orderDate,
                datasets:[{
                    data: orderCost,
                    fill: true,
            backgroundColor: 'rgb(3, 123, 252,0.1)',
            borderColor: 'rgb(3, 123, 252, 0.8)',
            tension: 0.3
                }]
            })
            
        })
        .catch(err=>{
            console.log(err)
        })

    }
    const fetchClients = async () => {

       await axios.get(`${BASE_URL}/api/clients`, {
           headers:config
       })
       .then(res=>{
  
           setClients(res.data)

       })
       .catch(err=>{
           console.log(err)
       })
       
    }
    const totalSales = () => {
        let sum = 0
        clients.map(client => {
            if(client.project_total === "--" || client.project_total === "")
                return
            sum += parseFloat(client.project_total)
        })
        return sum.toFixed(2)
    }
    const avgSales = () => {
        let sum = 0
        let index = clients.length
        clients.map((client) => {
            if(client.project_total === "--" || client.project_total === "")
                return
            sum += parseFloat(client.project_total)
        })
        return (sum/index).toFixed(2)
    }
    const lowestSale = () => {
        const sale = clients.map(client => client.project_total)
        console.log(sale)
        return numberWithCommas(parseFloat(Math.min(...sale)).toFixed(2))

        //numberWithCommas(parseFloat(Math.min(...lowestSale())).toFixed(2))
    }
    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    useEffect(()=>{
        fetchClients()
        fetchOrders()
    }, [loading])
    const data = {
        labels: ['1', '2', '3', '4', '5', '6'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            fill: true,
            backgroundColor: 'rgb(73,133,195, 0.1)',
            borderColor: 'rgb(73,133,195)',
            tension: 0.5
          },
        ],
    };
    const options = {
        plugins: {

            legend:{
                display: false
            }
        },
        scales: {
            
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
    };

    return (
        <>
        <Header/>
        <Container className="pt-5">
            <h2>Welcome back!</h2>
            <p>It's nice to have you back here, feel free to check and update our inventory.</p>
            <Row xs={12} md={12} className="g-4 pt-4">
                <Col>
                    <Card style={{borderRadius:"10px"}}>
                        <Card.Body className="d-flex flex-row align-items-center">
                            <div style={{backgroundColor: "rgb(3, 123, 252,0.1)", padding:"13px", borderRadius:"15px", width:"auto", height:"auto", marginRight:"1rem"}}>
                                <AiOutlineDollarCircle color="rgb(3, 123, 252)" fontSize={30}/>
                            </div>
                            <div>
                                <Card.Text style={{fontWeight: "500", color: "#b5b5b5", marginBottom: ".3rem"}}> 
                                    Total Sales
                                </Card.Text>
                                <Card.Title style={{marginBottom: "0"}}><h3 style={{marginBottom: "0"}}>₱ {numberWithCommas(totalSales())}</h3></Card.Title>
                            </div>
                            
                        </Card.Body>
                        </Card>
                </Col>
                <Col>
                <Card style={{borderRadius:"10px"}}>
                    <Card.Body className="d-flex flex-row align-items-center">
                            <div style={{backgroundColor: "rgb(49, 212, 65,0.1)", padding:"13px", borderRadius:"15px", width:"auto", height:"auto", marginRight:"1rem"}}>
                                <AiOutlineStock color="rgb(49, 212, 65)" fontSize={30}/>
                            </div>
                            <div>
                                <Card.Text style={{fontWeight: "500", color: "#b5b5b5", marginBottom: ".3rem"}}> 
                                    Top Sale
                                </Card.Text>
                                <Card.Title style={{marginBottom: "0"}}><h3 style={{marginBottom: "0"}}>₱ {numberWithCommas(parseFloat(clients.reduce((acc, shot) => acc = acc > shot.project_total ? acc : shot.project_total, 0)).toFixed(2))}</h3></Card.Title>
                            </div>
                            
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card style={{borderRadius:"10px"}}>
                        <Card.Body className="d-flex flex-row align-items-center">
                            <div style={{backgroundColor: "rgb(212, 49, 49,0.1)", padding:"13px", borderRadius:"15px", width:"auto", height:"auto", marginRight:"1rem"}}>
                                <AiOutlineFall color="rgb(212, 49, 49)" fontSize={30}/>
                            </div>
             
                            <div>
                            <Card.Text style={{fontWeight: "500", color: "#b5b5b5", marginBottom: ".3rem"}}> 
                                Lowest sale
                            </Card.Text>
                            <Card.Title style={{marginBottom: "0"}}><h3 style={{marginBottom: "0"}}>₱ {lowestSale()}</h3>
                            </Card.Title>
                            </div>
                            
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card style={{borderRadius:"10px"}}>
                        <Card.Body className="d-flex flex-row align-items-center">
                            <div style={{backgroundColor: "rgb(232, 203, 16,0.1)", padding:"13px", borderRadius:"15px", width:"auto", height:"auto", marginRight:"1rem"}}>
                                <AiOutlineThunderbolt color="rgb(232, 203, 16)" fontSize={30}/>
                            </div>
   
                            <div>
                            <Card.Text style={{fontWeight: "500", color: "#b5b5b5", marginBottom: ".3rem"}}> 
                                Average Sales
                            </Card.Text>
                            <Card.Title style={{marginBottom: "0"}}><h3 style={{marginBottom: "0"}}>₱ {numberWithCommas(avgSales())}</h3></Card.Title>
                            </div>
                            
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row style={{marginTop: "3rem"}}>
                
                <div className="d-flex align-items-center justify-content-between" style={{marginBottom: "1.5rem"}}>
                    <h4>Sales Report</h4>
                    <span style={{fontWeight: "500", color: "#b5b5b5"}}>Overall</span>
                </div>
                <Line data={chartData} options={options} />
            </Row>
            <Footer/>
        </Container>
        
        </>

        
    )
}
