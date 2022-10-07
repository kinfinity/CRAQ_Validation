
Change Request Acceptance Questions (CRAQ) 

N.B: must be satisfactorily answered in order for a change request to proceed to approval.

-> Questions : array of hashes

[
  {
    text: 'What is the meaning of life?',s
    options: [{ text: '41' }, { text: '42' }]
  }
]

-> Answers : hash  [0 - index start]

{q0: 1}

-> Invalid Cases : 
    - {}  = no answer
    - {q0: 3}  out of index

-> Terminal Questions :  correct answer for [ complete_if_selected: true ]

[
  {
    text: "What is the meaning of life?",
    options: [
      { text: "41" },
      { text: "42", complete_if_selected: true }
    ]
  },

  {
    text: "Why did you not select 42 as the answer to the previous question?",
    options: [
      { text: "I'd far rather be happy than right any day" },
      { text: "I don't get that reference" }
    ]
  }
]

-> Invalid : 

    - {q0: 0} = wrong answer on q0 and no answer for q1
    - {q0: 1, q1: 0} = answered after getting terminal question right


-> Errors : 

{
  q0: 'has an answer that is not on the list of valid answers',
  q1: 'was not answered',
  q2: 'was answered even though a previous response indicated that the questions were complete'
}

Define Question
Check Terminal Question
Verify Invalid Answer + Answer 
Check next Question
Set Answer/Error Hash


import/export Questions - json   serialize + deserialize
import/export Answers   - json   serialize + deserialize


app gets Questions + answer json and run validation

QuestionBank = 
- number of questions
[ *Question 
    - answer index count
    - answer array
    - question text
]

number of answers must < number of questions   - else ERROR more ansers than questions


Load dotenv config
- location of questions
- location of answers

files must be json

if no answer location prompt each question for answer

Question display + answer prompt



1 2 6 
3
4 5 
7 8 
9 11 12
10