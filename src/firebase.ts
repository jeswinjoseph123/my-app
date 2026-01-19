import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyC9UoAixJ0YtsReYfWX-bFYu3QwPtuRkhs",
    authDomain: "my-todo-81944.firebaseapp.com",
    projectId: "my-todo-81944",
    storageBucket: "my-todo-81944.firebasestorage.app",
    messagingSenderId: "502440368208",
    appId: "1:502440368208:web:0eb6a9fd250cd47b4c9955"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
