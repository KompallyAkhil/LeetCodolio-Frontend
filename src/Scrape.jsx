import React, { useState } from 'react';
import axios from 'axios';
import Spinner from './Spinner';
import './Scrape.css';
import { Chart as ChartJS } from "chart.js/auto";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bar, Doughnut } from "react-chartjs-2"
import logo from './download.png'

const Scrape = () => {
    const [username, setInput] = useState("")
    const [data, setData] = useState(null)
    const [spinner, setSpinner] = useState(false)
    function changeInput(e) {
        setInput(e.target.value);
    }
    async function FetchData(e) {
        setSpinner(true)
        try {
            if (username.length === 0 || username === null) {
                toast.warn("Enter a username");
                e.preventDefault();
                return;
            }
            const response = await axios.get(`http://localhost:5000/scrape/${username}`);
            setData(response.data);
            toast.success("Data fetched successfully!");
            setInput("")
        }
        catch (e) {
            toast.error("Enter a valid username");
            setData(null);
            setInput("")
        }
        finally {
            setSpinner(false)
        }
    }
    const EnterEvent = (e) => {
        if (e.key === "Enter") {
            FetchData()
        }
    }
    return (
        <>
            <div className='heading'>
                <span><img src={logo} alt='' /></span><h1 className='titles'>LeetCode Profile Tracker</h1>
            </div>
            <div className='searchcontainer'>
                <div className='searchbox'>
                    <h2>https://leetcode.com/u/ <span> <input onChange={changeInput} onKeyDown={EnterEvent} value={username} placeholder='Enter your Username' autoFocus /></span></h2>
                </div>
                <button className='fetch-button' onClick={FetchData}>Fetch Data</button>
                <ToastContainer theme="dark" position="top-right" pauseOnFocusLoss draggable autoClose={5000} pauseOnHover />
            </div>
            {data && (
                <div className='box'>
                    <div className='innerbox'>
                        <div className='subinner-box'>
                            <div className="card">
                                <div className="content">
                                    <p className="title">Total Questions</p>
                                    <p className="number">{data.TotalAttempted}</p>
                                </div>
                            </div>
                            <div className="card">
                                <div className="content">
                                    <p className="title">Total Active Days</p>
                                    <p className="number">{data.ActiveDays}</p>
                                </div>
                            </div>
                            <div className="card">
                                <div className="content">
                                    <p className="title">Rank</p>
                                    <p className="rank">{data.ProfileRank}</p>
                                </div>
                            </div>
                        </div>
                        <div className='images-box'>
                            <p>Awards {data.NumberOfBadges} </p>
                            <p>Top Badges</p>
                            <div className='images-container'>
                                {data.Badges.map((badge, i) => (
                                    <img className='badge-img' key={i} src={badge} />
                                ))}
                            </div>
                        </div>

                    </div>
                    <div className='chart'>
                        <p className='sections'>Problems Solved</p>
                        <p className='sections'>DSA</p>
                        <div>
                            <div className='inner-chart'>
                                <div className='questions'>
                                    <div className='mediums'>
                                        <p className='Easy'>Easy</p>
                                        <p className='a'>{data.SectionAttempted[0]}</p>
                                    </div>
                                    <div className='mediums'>
                                        <p className='Medium'>Medium</p>
                                        <p className='a'>{data.SectionAttempted[2]}</p>
                                    </div>
                                    <div className='mediums'>
                                        <p className='Hard'>Hard</p>
                                        <p className='a'>{data.SectionAttempted[4]}</p>
                                    </div>
                                </div>

                                <Doughnut data={{
                                    labels: ["Easy", "Medium", "Hard"],
                                    datasets: [
                                        {
                                            label: "Value",
                                            data: [data.SectionAttempted[0], data.SectionAttempted[2], data.SectionAttempted[4]],
                                            backgroundColor: ["rgba(74,222,128)", "rgba(250,204,21,1)", "rgba(239,68,68)"],
                                            hoverBackgroundColor: ["rgba(74,222,110)", "rgba(250,204,19,1)", "rgba(239,68,21)"],
                                            borderRadius: 1,
                                            rotation: 360
                                        }
                                    ],
                                }} options={{ responsive: true, aspectRatio: false }} />
                            </div>

                        </div>
                    </div>
                </div>
            )}
            {data  && (
                <div className='bar-boxing'>
                    <div className='bar-box'>
                        <Bar
                            data={{
                                labels: data.Skills.map((skill, index) => skill),
                                datasets: [
                                    {
                                        label: 'Skills Proficiency',
                                        data: data.elements,
                                        backgroundColor: [
                                            "rgba(75, 192, 192, 0.2)",
                                            "rgba(153, 102, 255, 0.2)",
                                            "rgba(255, 159, 64, 0.2)",
                                        ],
                                        borderColor: [
                                            "rgba(75, 192, 192, 1)",
                                            "rgba(153, 102, 255, 1)",
                                            "rgba(255, 159, 64, 1)",
                                        ],
                                        borderWidth: 1,
                                        barThickness: 50,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                aspectRatio: 2,
                                scales: {
                                    x: {
                                        ticks: {
                                            color: 'white',
                                        },
                                        grid: {
                                            borderColor: 'white',
                                        },
                                    },
                                    y: {
                                        ticks: {
                                            color: 'white',
                                        },
                                        grid: {
                                            borderColor: 'white',
                                        },
                                    },
                                },
                                plugins: {
                                    legend: {
                                        labels: {
                                            color: 'white'
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                    <div className='sub-bar'>
                        <p className='sub-heading'>Recently Solved Questions</p>
                        {data.RecentlySolveds.slice(0,8).map((item,index)=>(
                            <div className='solved-ques'>
                                <span key={index}> {item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}


            {spinner && <Spinner />}
        </>
    )
}
export default Scrape