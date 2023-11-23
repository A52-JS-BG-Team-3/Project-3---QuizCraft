# Functional Requirements Checklist

## Entities

### User
- [x] Authentication handled by Firebase.
- [x] Username is unique and between 3 and 30 characters.
- [x] First and last names are between 1 and 30 characters, containing only uppercase and lowercase letters.
- [x] Phone numbers have 10 digits and are unique in the system.
- [ ] Users can be educators or students.

### Quiz
- [ ] Title is between 3 and 30 characters and unique.
- [ ] Quiz is associated with its creator.
- [ ] Category can be reused from previous quizzes.
- [ ] Option to include a timer for quiz completion.
- [ ] Total points available are indicated.
- [ ] Quizzes include a scoreboard for participant rankings.
- [ ] Quizzes can be marked as public or private.

## Public Part
- [ ] Landing page shows the latest quiz or compelling content.
- [ ] Login form redirects to the private area.
- [ ] Register form registers users as Educators or Students.
- [ ] Anonymous users can browse and search for public quizzes.
- [ ] Feature for users to try out a sample quiz without registering.

## Private Part
- [ ] All quizzes page is different for Educators and Students.
- **For Educators:**
  - [ ] Set up a new Quiz with custom questions and answers.
  - [ ] Manage quizzes created, including editing or deleting them.
  - [ ] Invite students to take quizzes.
  - [ ] View Ongoing and Finished quizzes.
  - [ ] View students.
- **For Students:**
  - [ ] View active quizzes.
  - [ ] View quizzes currently participating in.
  - [ ] View quiz contests participated in.
  - [ ] View scoreboards of quizzes participated in.
- [x] Profile editing for all users.
- [ ] Scoring implemented for ordered ranking (optional).

## Quiz Requirements
- [ ] User can participate in multiple quizzes.
- [ ] Users can accept or reject invitations to private quizzes.
- [ ] Creators can set time limits, question order randomization, and passing scores for quizzes.
- [ ] Quiz status (Ongoing/Finished) always visible.
- [ ] Ability to review answers and add comments for Finished quizzes.

## Administrative Part
- **User Management:**
  - [ ] Admins can search for users by username, first and last name, email.
  - [ ] Lists of users support pagination or infinite scroll functionality.
  - [ ] Admins can block and unblock individual users.
  - [ ] Blocked users cannot login.
- **Quiz Management:**
  - [ ] Admins can edit or delete any quiz.
- **Scoreboard Moderation:**
  - [ ] Admins can oversee scoreboards for tests and address discrepancies.

## Educator Features 
- [ ] Educators separated into groups.
- [ ] Educators in the same group can edit or delete any quiz created by someone on their team.



