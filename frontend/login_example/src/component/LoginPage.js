import LoginForm from "./LoginForm";
import ResponseText from "./ResponseText";
import { useState } from "react";

/**
 * * LoginPage component
 * @returns LoginPage
 */
const LoginPage = function () {
    const [response, setResponse] = useState("");

    /**
     * * 傳入LoginFrom中的callback function 會呼叫此function
     * * 在此function 中將response(state)進行更新，結果會用於<ResponseText/>中
     * @param {Object or Null} formData
     * @returns
     */
    function handleLoginFormSubmit(formData) {
        console.log(
            "🚀 ~ file: LoginPage.js:10 ~ handleLoginFormSubmit ~ formData:",
            formData
        );
        if (!formData) {
            setResponse("⚠️Backend Server Error. Server may not executing...");
            return;
        }
        var string = JSON.stringify(formData);
        if (formData.data) {
            string = JSON.stringify(formData.data.user);
        }
        setResponse(string);
    }

    return (
        <div>
            <LoginForm onLoginFormSubmit={handleLoginFormSubmit} />
            <ResponseText text={response} />
        </div>
    );
};

export default LoginPage;
