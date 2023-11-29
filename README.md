# Functional Requirements Checklist

## Entities

### User
- [x] Authentication handled by Firebase.
- [x] Username is unique and between 3 and 30 characters.
- [x] First and last names are between 1 and 30 characters, containing only uppercase and lowercase letters.
- [x] Phone numbers have 10 digits and are unique in the system.
- [x] Users can be educators or students.

### Quiz
- [x] Title is between 3 and 30 characters and unique.
- [x] Quiz is associated with its creator.
- [x] Category can be reused from previous quizzes.
- [x] Option to include a timer for quiz completion.
- [x] Total points available are indicated.
- [ ] Quizzes include a scoreboard for participant rankings.
- [x] Quizzes can be marked as public or private.

## Public Part
- [x] Landing page shows the latest quiz or compelling content.
- [x] Login form redirects to the private area.
- [x] Register form registers users as Educators or Students.
- [ ] Anonymous users can browse and search for public quizzes.
- [ ] Feature for users to try out a sample quiz without registering.

## Private Part
- [x] All quizzes page is different for Educators and Students.
- **For Educators:**
  - [x] Set up a new Quiz with custom questions and answers.
  - [x] Manage quizzes created, including editing or deleting them.
  - [x] Invite students to take quizzes.
  - [ ] View Ongoing and Finished quizzes.
  - [ ] View students.
- **For Students:**
  - [x] View active quizzes.
  - [ ] View quizzes currently participating in.
  - [ ] View quiz contests participated in.
  - [ ] View scoreboards of quizzes participated in. Scoring should ne implemented for ordered ranking.
- [x] Profile editing for all users.

## Quiz Requirements
- [x] User can participate in multiple quizzes.
- [ ] Users can accept or reject invitations to private quizzes.
- [x] Creators can set time limits, question order randomization, and passing scores for quizzes.
- [ ] Quiz status (Ongoing/Finished) always visible.
- [ ] Ability to review answers and add comments for Finished quizzes.

## Administrative Part
- **User Management:**
  - [x] Admins can search for users by username, first and last name, email.
  - [x] Lists of users support pagination or infinite scroll functionality.
  - [x] Admins can block and unblock individual users.
  - [x] Blocked users cannot login.
- **Quiz Management:**
  - [x] Admins can edit or delete any quiz.
- **Scoreboard Moderation:**
  - [ ] Admins can oversee scoreboards for tests and address discrepancies.

## Educator Features 
- [x] Educators separated into groups.
- [x] Educators in the same group can edit or delete any quiz created by someone on their team.



