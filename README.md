# GFG Solving for India Hackathon
- GeeksforGeeks in collaboration with Google Cloud and AMD for the very first time brings to you a Pan-India Hackathon which aims at building innovative projects based on a chosen theme.

## FamCart - Your Cashless Wallet

- FamCart is a comprehensive solution designed to enable a cashless school system in India. It addresses the challenges of cash transactions in schools by providing a user-friendly platform that allows parents to digitally manage their children's expenses while also monitoring their spending habits and dietary preferences. FamCart offers a range of features, including user registration and login, integration with a payment gateway for easy money transfer, request money functionality for children, transaction management for both parents and children, a restriction system for parents to control purchases, and a personalized AI chatbot for financial education and management. FamCart is built on a robust architecture using Firebase (Google Cloud Platform) for database management and Stripe for payment integration. It also incorporates LangChain, a framework built around Large Language Models (LLMs), for the development of the AI chatbot. Overall, FamCart aims to provide a safe, efficient, and user-friendly solution for cashless transactions in schools, empowering parents and children to manage their finances effectively while promoting financial literacy and healthy spending habits.

## Features
FamCart offers a range of features to facilitate cashless transactions in schools:

- User registration and login: Parents can create accounts and securely log in to the FamCart platform.
- Payment gateway integration: FamCart integrates with a payment gateway for easy and secure money transfer between parents and schools.
- Request money functionality: Children can request money from their parents through the platform for school expenses.
- Transaction management: Parents and children can view and manage transaction history, including purchases and top-ups.
- Restriction system: Parents can set purchase restrictions for their children to control spending and promote healthy financial habits.
- AI chatbot: FamCart includes a personalized AI chatbot for financial education and management, built using LangChain framework based on Large Language Models (LLMs).

## Future Improvements/Add-ons:
1. We are able to develop the AI chatbot and make our website redirect to where the chatbot has been deployed. Currently, the chatbot is deployed separately due to time constraints. We aim to integrate the AI chatbot feature into our website which will be knowledge-based and will keep track of the expenditure of the child and can help ease the process of financial management on behalf of the parents. Users can use the chatbot to obtain personalized financial advice. The technology can generate customized financial plans and investment strategies based on a user’s goals, risk tolerance, and financial situation. It can also identify the spending patterns of the student and offer suggestions for budget optimization. This feature can be accomplished by the use of LangChain which can access the database of the service and recognize the patterns for each individual.
2. Virtual card – A virtual card will be generated through which children can pay for the items they wish to purchase. The card will have a unique QR code and unique ID that can be used to track all purchases and transactions.
3. Restriction- At the moment, we are able to limit the things that students can buy on a weekly basis. We can expand that on a daily and monthly basis, where the child receives a message of alarm when the permissible amount of a particular item has been exceeded daily and monthly. This can help in providing Financial Discipline, Budget Management , Parental Control
4. Expenditure graph / Data Visualization – They can view the things and the number of items they bought in the form of different statistical models and charts on a monthly and weekly basis. Both parents and kids will be able to see this page. For visualizing expenditure data, libraries and frameworks such as Chart.js, D3.js, or Plotly can be used to create interactive charts, graphs, or visualizations that provide insights into spending patterns and trends. We believe Tracking the expenditure of children on a monthly and weekly basis using data analysis and visualization can provide several benefits like Budget Planning , Expense Tracking , Accountability and descision making.

## How to run the project for development:
```
npm install
npm start
```

## Our test credentials are :
(parent side)
parent email:parentc@gmail.com
parent password:123456

(child 1)
child email:childc1@gmail.com
child password:123456

(child 2)
child email:childc2@gmail.com
child password:123456

**Link to FamCart AI Chatbot :** 
[FamCart-AI-Chatbot](https://github.com/AbhishekRP2002/FamCart-AI-Chatbot)

**Figma Link to UI of FamCart :** 
[FamCart-UI](https://www.figma.com/file/XrmXeMnmdaPu5B8Ad9lqSH/E-commerce-web-site-(Community)?node-id=179-12&t=SJAJMSXRJrDocWHw-0)
