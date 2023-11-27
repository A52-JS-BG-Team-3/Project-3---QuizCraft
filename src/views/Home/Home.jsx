import './Home.css';
import quizImage from '../../assets/quiz.png';
import LatestQuizz from '../../components/LatestQuizz/LatestQuizz';

export default function Home() {
    return (
        <div className="image-container">
            <LatestQuizz />
            <img src={quizImage} alt="quiz" className="centered-image" />
        </div>
    );
}
