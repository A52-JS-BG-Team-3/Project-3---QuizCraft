import './Home.css';
import quizImage from '../../assets/quiz.png';
import QuizPicker from '../../components/Quiz/Quiz';

export default function Home() {
    return (
        <div className="image-container">
            <QuizPicker />
            <img src={quizImage} alt="quiz" className="centered-image" />
        </div>
    );
}
