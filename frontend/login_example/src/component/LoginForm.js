import React, { useState } from "react";

/**
 * * Login 表單
 * @param {Object} props
 * @returns
 */
const LoginForm = function (props) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    /**
     * * 當表單提交時執行
     * * 呼叫props傳入的callback function: onLoginFormSubmit()
     * @param {Event} e
     */
    async function handleSubmit(e) {
        e.preventDefault();

        const name = e.target.elements.name.value;
        const email = e.target.elements.email.value;
        const password = e.target.elements.password.value;
        const userData = { name, email, password };
        console.log(
            "🚀 ~ file: LoginForm.js:13 ~ handleSubmit ~ userData:",
            userData
        );
        console.log(typeof userData);

        const res = await APItest_POST(userData);
        console.log("🚀 ~ file: LoginForm.js:19 ~ handleSubmit ~ res:", res);

        props.onLoginFormSubmit(res);
    }

    return (
        <form
            method="post"
            onSubmit={handleSubmit}
        >
            <label>
                name:
                <input name="name" />
            </label>
            <br />
            <label>
                email:
                <input
                    name="email"
                    type="email"
                />
            </label>
            <br />
            <label>
                password:
                <input
                    name="password"
                    type="password"
                />
            </label>
            <br />
            <button type="submit">Signup</button>
        </form>
    );
};

function APItest_GET() {
    console.log("GET method test");
    fetch("http://localhost:4000/users/?id=1", {
        method: "GET",
        headers: {
            "content-type": "application/json",
            "Request-Date": `${new Date().toUTCString()}`,
        },
    })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.error(err));
}
/**
 * * 使用fetch API來對後端server發出POST請求
 * @param {Object} userData
 * @returns res.json()
 */
async function APItest_POST(userData) {
    console.log("POST method test");
    const data = await fetch("http://localhost:4000/users/", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "Request-Date": `${new Date().toUTCString()}`,
        },
        body: JSON.stringify(userData),
    })
        .then((res) => {
            // if(res.statusCode === 200){
            //     return res.json();
            // }else if(res.statusCode === 403){
            //     return {"error": "email "}
            // }
            return res.json();
        })
        .then((data) => {
            console.log("🚀 ~ file: LoginForm.js:74 ~ .then ~ data:", data);
            return data;
        })
        .catch((err) => {
            console.error(err);
        });

    return data;
}

export default LoginForm;
