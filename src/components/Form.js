import React from 'react'

const Form = (props) => (
    <div>
        <form action="">
            <input onBlur={(event) => props.onBlur(event)} type="text" name="login" placeholder="Login" />
            <input onBlur={(event) => props.onBlur(event)} type="password" name="password" placeholder="Password" />
            <button onClick={() => props.onSubmit()} type="button" name="submit">Log In</button>
        </form>
    </div>
)

export default Form;