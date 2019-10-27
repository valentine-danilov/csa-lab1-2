import React from 'react'
import Form from './Form';
import { encryptAES_CBC } from './AESUtils'

const NodeRSA = require('node-rsa');


export default class Main extends React.Component {
    constructor(props) {
        super(props);

        const key = new NodeRSA().generateKeyPair(512)
        key.setOptions({ encryptionScheme: 'pkcs1' });

        this.state = {
            loggedUser: {
                login: "admin",
                password: "",
            },
            publicKey: null,
            privateKey: null,
            token: null,
            rsa: key
        }
    }

    async onSubmit() {

        const publicKey = this.state.publicKey;
        if (publicKey) {

            const body = {
                key: publicKey
            };

            const response = await fetch("http://localhost:9000/auth/token/request", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            const json = await response.json();

            alert("Successfully requested encrypted token");

            const token = json.token;

            const decryptedToken = this.decryptToken(token);

            alert("Successfully decrypted token");

            alert("Successfully encrypted creds");

            this.setState({
                token: decryptedToken
            });

            this.encryptLoginAndPassword();

        } else {
            alert('No public key generated');
        }

    }

    generateKeys() {

        const publicKey = this.state.rsa.exportKey("pkcs1-public-pem");
        const privateKey = this.state.rsa.exportKey("pkcs8-private-pem");

        this.setState({
            publicKey: publicKey,
            privateKey: privateKey
        })
    }

    decryptToken(token) {
        return this.state.rsa.decrypt(token, 'utf8');
    }

    handleValueChange(event) {
        event.preventDefault();
        const inputName = event.target.name;
        const inputValue = event.target.value;

        const user = this.state.loggedUser;

        user[inputName] = inputValue;

        console.log(inputName + ": " + user[inputName])

        this.setState({
            loggedUser: user
        });
    }

    encryptLoginAndPassword() {
        let login = this.state.loggedUser.login;
        let password = this.state.loggedUser.password;
        let key = this.state.token;

        login = encryptAES_CBC(key, login);
        password = encryptAES_CBC(key, password);

        console.log("login: " + login);
        console.log("password: " + password);

        this.setState({
            loggedUser: {
                login: login,
                password: password
            }
        })
    }

    render() {
        return (
            <div>
                <p>{this.state.publicKey}</p>
                <Form onBlur={(event) => this.handleValueChange(event)} onSubmit={() => this.onSubmit()} />
                <button type="button" onClick={() => this.generateKeys()}>Generate Keys</button>
            </div >
        )
    }
}