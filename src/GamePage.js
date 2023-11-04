import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Game from './Game';
import api from './api';
import Typewriter from 'typewriter-effect';

Modal.setAppElement('#root');

const GamePage = () => {
    const [username, setUsername] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(true);
    const [userData, setUserData] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [currentScore, setCurrentScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [highScoresList, setHighScoresList] = useState([]);
    const [error, setError] = useState('');
  
    useEffect(() => {
        if (gameOver) {
            fetchHighScores();
        }
    }, [gameOver]);

    const fetchHighScores = async () => {
        try {
            const response = await api.get('/highscores');
            setHighScoresList(response.data);
        } catch (err) {
            console.error("Error fetching high scores:", err);
        }
    };
    
    const handleUsernameChange = (event) => {
      setUsername(event.target.value);
    };
  
    const handleLoginOrCreate = async () => {
      try {
        const response = await api.get(`/users/by_username/${username}`);
        setUserData(response.data);
        setModalIsOpen(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Username not found, try to create a new account
          await handleCreateAccount();
        } else {
          setError('An error occurred. Please try again.');
        }
      }
    };
  
    const handleCreateAccount = async () => {
      try {
        const response = await api.post('/users/', { username });
        setUserData(response.data);
        setModalIsOpen(false);
      } catch (err) {
        setError('An error occurred while creating the account. Please try again.');
      }
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      await handleLoginOrCreate();
    };
    
    const handleUpdateCurrentScore = (score) => {
        setCurrentScore(score);
        console.log(score)
    };

    const handleGameOver = (scoreData) => {
        setHighScore(scoreData.high_score);
        setCurrentScore(scoreData.current_score);
        setGameOver(true);
    };

    const handleTryAgain = () => {
        setGameOver(false);
        setCurrentScore(0);
    };

    useEffect(() => {
        console.log(`Current score updated to: ${currentScore}`);
    }, [currentScore]);
  
    return (
        <div>
        <Modal isOpen={modalIsOpen} style={{ overlay: { background: 'rgba(0, 0, 0, 0.75)' }, content: { height: '500px', background: '#f0f0f0', borderRadius: '15px', border: '5px solid #0088cc' } }}>
            <div class="row justify-content-center" style={{background: ''}}>
                <h2 style={{textAlign: 'center'}}>Can you spot the bot?</h2>
                <h4 style={{textAlign: 'center'}}>Try to guess which image is <span style={{color: 'green'}}>Real</span> or <span style={{color: 'red'}}>Fake</span></h4>
                <form onSubmit={handleSubmit} style={{ textAlign: 'center', padding: '20px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '20px' }}>
                    Enter Username:
                    <input type="text" value={username} onChange={handleUsernameChange} style={{ marginLeft: '10px', padding: '5px', borderRadius: '5px', border: '2px solid #0088cc' }} />
                </label>
                <button type="submit" style={{ display: 'block', margin: '20px auto', padding: '10px 20px', background: '#0088cc', color: 'white', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>Login / Create</button>
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </form>
            </div>
        </Modal>
    
        {userData && !gameOver && (
            <div>
                <div style={{ zIndex: '1', position: 'absolute', top: '2%', left: '37%', color: 'black', background: '', padding: '5px 10px', borderRadius: '0px', fontWeight: 'bold' }}> 
                    <p style={{fontFamily: 'Roboto', color: 'white', fontSize: '45px'}}>Current Score: {currentScore}</p> 
                </div>
                <Game 
                    userId={userData.id} 
                    onGameOver={handleGameOver}
                    updateCurrentScore={handleUpdateCurrentScore}  
                />
            </div>
        )}
    
        {gameOver && 
                <div class= "container mt-0 pt-3" style={{ textAlign: 'center', marginTop: '50px', height: '100vh' }}>
                    <div class= "row">
                        <div class = "col-3 m-0 p-0"></div>
                        <div class= "col-6 m-0 p-0" style={{margin: '0px', border: 'solid 5px #BCE2F4', borderRadius: '10px', color:''}}>
                            <div class="card bg-dark" style={{color: 'white'}}>
                                <div class="card-header" style={{fontSize: '35px'}}>Game Over!</div>
                                    <div class="card-body">
                                        <h5 class="card-title" style={{fontSize: '30px', color: '#BCE2F4'}}>    
                                                {
                                                    currentScore === 10 ? (
                                                    <div>
                                                    <p style={{color: 'white', fontWeight: 'bold', fontSize: '40px'}}>{username}</p>
                                                    <p>Congratulations, you beat the bot!</p>
                                                    </div>
                                                    ) : (
                                                    <div>
                                                    <p style={{color: 'white', fontWeight: 'bold', fontSize: '40px'}}>{username}</p>
                                                    <p> You didn't beat the bot. Try again!</p>
                                                    </div>
                                                 )}
                                            </h5>
                                            <div class="card-text" style={{color: '#E6B382', fontSize: '28px', textAlign: 'left', padding: '50px 0px 0px 50px'}}>
                                            <Typewriter
                                                onInit={(typewriter) => {
                                                    typewriter.typeString(`Round Score: ......................${currentScore}`)
                                                    .pauseFor(75)
                                                    .start();
                                                  }}
                                            />
                                            <Typewriter
                                                onInit={(typewriter) => {
                                                    typewriter.typeString(`Accuracy: ............................${currentScore*10}%`)
                                                    .pauseFor(75)
                                                    .start();
                                                  }}
                                            />
                                            <Typewriter
                                                onInit={(typewriter) => {
                                                    typewriter.typeString(`Games Played: ...................${userData.games_played}`)
                                                    .pauseFor(75)
                                                    .start();
                                                  }}
                                            />
                                            <Typewriter
                                                onInit={(typewriter) => {
                                                    typewriter.typeString(`High Score: .........................${highScore}`)
                                                    .pauseFor(75)
                                                    .start();
                                                  }}
                                            />
                                            </div>
                                            <div class="card-text" style={{paddingTop: '100px'}}>
                                                <button onClick={handleTryAgain} style={{ margin: '10px', padding: '10px 20px', background: '#0088cc', color: 'white', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>Try Again!</button>
                                                <a href='/' ><button style={{ padding: '10px 20px', background: 'red', color: 'white', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>Sign Out</button></a>
                                            </div>
                                    </div>
                            </div>
                        </div>
                        <div class = "col-3 m-0 p-0" style={{ margin: '0px', border: 'solid 5px #BCE2F4', borderRadius: '10px', height: '305px'}}>
                            <body>
                                <center>
                                    <h1 style={{backgroundColor: 'black' ,color: 'white', textDecoration: 'underline', marginBottom: '0px'}}>HIGH SCORES</h1>
                                </center>
                            <table class="table table-striped table-dark " >
                                <thead>
                                    <tr>
                                        <th scope='col'>Rank</th>
                                        <th scope='col'>Username</th>
                                        <th scope='col'>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {highScoresList.slice(0, 5).map((scoreEntry, index) => (
                                        <tr key={index}>
                                            <td>{index+1}</td>
                                            <td>{scoreEntry.username}</td>
                                            <td>{scoreEntry.high_score}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </body>
                        </div>
                    </div>
                </div>
            }
    </div>
    );
  }
  
  export default GamePage;