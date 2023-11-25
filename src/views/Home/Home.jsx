import './Home.css';
import quizImage from '../../assets/quiz.png';


export default function Home() {
    return (
        <div className="image-container">
            
            <img src={quizImage} alt="quiz" className="centered-image" />
        </div>
    );
}
