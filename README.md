![Quizy Peazy Logo](src/assets/logo.png)

## Overview

🌟 Welcome to Quizy Peazy! 🌟

Embark on a thrilling journey of knowledge and fun with our state-of-the-art quiz application built just for you! 🚀

🧠 Challenge Your Mind: Dive into a world of diverse quizzes that cater to every interest and curiosity. From science wizards to pop culture enthusiasts, there's a quiz for everyone! 🧠

🏆 Achieve Greatness: Test your knowledge, earn points, and climb the ranks on our global leaderboard. Will you be the ultimate Quizer Peazer? 🏆

🌈 Interactive Experience: Immerse yourself in a visually stunning and user-friendly interface. Say goodbye to dull quizzes – our vibrant design will keep you hooked from start to finish! 🌈

📚 Quiz History at Your Fingertips: Track your progress with ease. Access your personalized quiz history and witness your growth over time. Celebrate your victories and learn from your challenges! 📚

🤩 Real-time Feedback: Receive instant feedback on your quiz performance. Understand your strengths and areas for improvement, making each quiz a stepping stone to becoming a genius. 🤩

🌐 Connect with the Community: Engage with fellow quiz enthusiasts, share your achievements, and discover exciting new quizzes. Quizy Peazy isn't just an app; it's a thriving community of knowledge seekers! 🌐

Ready to elevate your quiz experience? Join Quizy Peazy today and unlock the gateway to limitless learning and entertainment! 🚀🎓

## Features

1. [Features](#features)
2. [Public Part](#public-part)
3. [Private Part](#private-part)
4. [Administrative Part](#administrative-part)
5. [Getting Started](#getting-started)
6. [Contributing](#contributing)
7. [License](#license)

## Features

### Entities

- **User Authentication**: Handled by Firebase. Users have unique usernames, emails, phone numbers, and photos. Users can be organizers or students.

- **Quizzes**: Unique IDs, titles, categories, types (open or invitational), sets of questions, answer options, scoring mechanisms, and creators. Quizzes can be public or private.

- **Scoreboards**: Rankings for users and quizzes. Scoreboards for different quiz categories.

- **Search Functionality**: Users can search public quizzes by keywords, categories, or tags.

- **Groups of Educators**: Educators can participate in groups, modify quizzes within their group, and view quizzes outside their group.

### Public Part

#### Landing Page

- Latest public quizzes showcased.

#### Login Form

- Requires username and password.

#### Register Form

- Registers users as educators or students.

#### Quiz Browsing

- Anonymous users can browse and search for public quizzes.

#### Sample Quiz

- Feature for users to try out a sample quiz without registering.

### Private Part

#### All Quizzes Page

**For Educators:**

- Set up new quizzes.
- Manage quizzes (edit, delete).
- Invite students to quizzes.
- View ongoing and finished quizzes.
- View students.

**For Students:**

- View active quizzes.
- View participated quizzes and contests.
- View scoreboards.

#### Profile Editing

- Users can see and edit their profile information.

#### Quiz Requirements

- Quiz participation and invitation acceptance.
- Quiz settings: time limits, question randomization, passing scores.

#### Quiz Page

- Ongoing and finished quiz status.
- Review answers with comments.

#### Create Quiz Page

- Create quiz form with title, category, type, time limit, questions, and answers.

### Administrative Part

#### User Management

- Admins can search, block, and unblock users.

#### Quiz Management

- Admins can edit or delete any quiz.

#### Scoreboard Moderation

- Admins can oversee scoreboards and address discrepancies.

## Getting Started

To run the QuizMaster Pro application locally, follow these steps:

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Run the application using `npm run dev`.

## Contributing

We welcome contributions! Please check out our [Contribution Guidelines](CONTRIBUTING.md) for details on how to contribute.

## License

This project is licensed under the [TEAM 3 License](LICENSE).


