import React, { useEffect, useState } from "react";
import Toast from 'react-bootstrap/Toast';
import api from "./api";

const Game = ({ userId, onGameOver, updateCurrentScore }) => {
    const [isCorrect, setIsCorrect] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [realImage, setRealImage] = useState('');
    const [fakeImage, setFakeImage] = useState('');
    const [realImageIndex, setRealImageIndex] = useState(0);
    const [fakeImageIndex, setFakeImageIndex] = useState(0);
    const [isRealImageLeft, setIsRealImageLeft] = useState(Math.random() < 0.5);

    const handleButtonClick = async (choice) => {
        setIsCorrect(choice);
        try {
            const response = await api.put(`/users/${userId}/update_score`, { correct: choice });
            const { current_score, high_score, game_won } = response.data;
            updateCurrentScore(current_score);
            if (game_won) {
                onGameOver({ high_score, current_score });
            } else if (!choice) {
                onGameOver({ high_score, current_score });
            } else {
                setTimeout(() => {
                    loadImages();
                    setIsRealImageLeft(Math.random() < 0.5);
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 1500);
                }, 500);
            }
        } catch (error) {
            console.error('Error updating score:', error);
            // Handle the error accordingly
        }
    };

    const realImages = [require(`./Real/apple.png`), require(`./Real/beach.png`), require(`./Real/redhouse.png`), require(`./Real/empty.png`), require(`./Real/redcarpet.png`), 
                        require(`./Real/suburb.png`), require(`./Real/walkway.png`), require(`./Real/wall.png`), require(`./Real/billboard.png`), require(`./Real/mountain.png`)];
    const fakeImages = [require(`./Fake/house.png`), require(`./Fake/orange.png`), require(`./Fake/toaster.png`), require(`./Fake/beach.png`), require(`./Fake/lake.png`), 
                        require(`./Fake/road.png`), require(`./Fake/ancientcity.png`), require(`./Fake/rushhour.png`), require(`./Fake/winecheese.png`), require(`./Fake/winter.png`)]; 

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; 
        }
    }
    
    const loadImages = () => {
        if (realImageIndex >= realImages.length) {
            shuffleArray(realImages);
            setRealImageIndex(0);
        }
        if (fakeImageIndex >= fakeImages.length) {
            shuffleArray(fakeImages);
            setFakeImageIndex(0);
        }

        setRealImage(realImages[realImageIndex]);
        setFakeImage(fakeImages[fakeImageIndex]);

        setRealImageIndex(realImageIndex + 1);
        setFakeImageIndex(fakeImageIndex + 1);
        setIsRealImageLeft(Math.random() < 0.5);
    }


    useEffect(() => {
        shuffleArray(realImages);
        shuffleArray(fakeImages);
        loadImages();
    }, []);
    
    return (
        <div className="container pt-5" style={{ maxWidth: '1325px', height: '100vh', margin: '0 auto', overflow: 'hidden', border: '' }}>
            <div className="row">
                {isRealImageLeft ? (
                    <>
                    <div className="col-6" style={{ position: 'relative', height: '', width: '', border: '' }}>
                        <img src={require(`./GameImages/bg4.png`)} alt="Background" style={{ width: '', height: '97%', rotate: '90deg', objectFit: 'cover' }} />
                        <img 
                            src={realImage}
                            alt="Real"
                            style={{ position: 'absolute', top: '15%', left: '9.9%', width: '79.9%', height: '67.2%' }} 
                        />
                        <button type="button" class="btn btn-light"
                            onClick={() => handleButtonClick(false)} 
                            style={{ position: 'absolute', top: '93%', left: '40%' }}
                        >
                                Fake Image?
                        </button>
                    </div>
                    <div className="col-6" style={{ position: 'relative', height: '', width: '', border: '' }}>
                        <img src={require(`./GameImages/bg4.png`)} alt="Background" style={{ width: '', height: '97%', rotate: '90deg', objectFit: 'cover' }} />
                        <img 
                            src={fakeImage}
                            alt="Fake"
                            style={{ position: 'absolute', top: '15%', left: '9.9%', width: '79.9%', height: '67.2%' }} 
                        />
                        <button type="button" class="btn btn-light"
                            onClick={() => handleButtonClick(true)} 
                            style={{ position: 'absolute', top: '93%', left: '40%' }}
                        >
                            Fake Image?
                        </button>
                    </div>
                </>
                ) : (
                    <>
                    <div className="col-6" style={{ position: 'relative', height: '', width: '', border: '' }}>
                        <img src={require(`./GameImages/bg4.png`)} alt="Background" style={{ width: '', height: '97%', rotate: '90deg', objectFit: 'cover' }} />
                        <img 
                            src={fakeImage}
                            alt="Fake"
                            style={{ position: 'absolute', top: '15%', left: '9.9%', width: '79.9%', height: '67.2%' }} 
                        />
                        <button type="button" class="btn btn-light"
                            onClick={() => handleButtonClick(true)} 
                            style={{ position: 'absolute', top: '93%', left: '40%' }}
                        >
                            Fake Image?
                        </button>
                    </div>
                    <div className="col-6" style={{ position: 'relative', height: '', width: '', border: '' }}>
                        <img src={require(`./GameImages/bg4.png`)} alt="Background" style={{ width: '', height: '97%', rotate: '90deg', objectFit: 'cover' }} />
                        <img 
                            src={realImage}
                            alt="Real"
                            style={{ position: 'absolute', top: '15%', left: '9.9%', width: '79.9%', height: '67.2%' }} 
                        />
                        <button type="button" class="btn btn-light"
                            onClick={() => handleButtonClick(false)} 
                            style={{ position: 'absolute', top: '93%', left: '40%' }}
                        >
                                Fake Image?
                        </button>
                    </div>
                </>
                )}
                <div class="col-12">
                <Toast style={{position: 'absolute', top: '50%', left: '38%', zIndex: '1', backgroundColor: '#2ECC71'}} onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                            
                            <Toast.Body style={{color: 'white', fontSize: '40px'}}><strong className="me-auto">Correct!</strong></Toast.Body>
                </Toast>
                </div>
            </div>
                {isCorrect !== null && (
                    <p style={{ position: 'absolute', bottom: '10px', width: '100%' }}>
                        {isCorrect ? "" : "Game Over!"}
                    </p>
                )}
            
        </div>
    )
}
export default Game;