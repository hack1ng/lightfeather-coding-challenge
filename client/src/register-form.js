import React from 'react';
import { Button, Box } from '@material-ui/core';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import './register-form.css';
 
export class RegisterForm extends React.Component {
 
    state = {
        user: {
            username: '',
            email: '',
            password: '',
            repeatPassword: ''
        },
        validated: {
            username: false,
            email: false,
            password: false,
            repeatPassword: false
        },
        errors: {
            username: '',
            email: '',
            password: '',
            repeatPassword: ''
        },
        disabled: true
    }

    formRef = React.createRef();
    usernameRef = React.createRef();
    emailRef = React.createRef();
    passwordRef = React.createRef();
    repeatPasswordRef = React.createRef();
    
    handleChange = (event) => {
        const { user } = this.state;
        user[event.target.name] = event.target.value;
        this.setState({ user });
    }

    // validate field once user is finished entering information
    handleBlur = (event) => {
        const { value, name } = event.target;
        if(name === "username") {
            this.usernameRef.current.validate(value, true);
        } else if(name === "email") {
            this.emailRef.current.validate(value);
        } else if(name === "password") {
            this.passwordRef.current.validate(value, true);
        } else if(name === "repeatPassword") {
            this.repeatPasswordRef.current.validate(value, true);
        }
    }

    // after validation, check to see if submit button should be enabled
    validatorListener = () => {
        const { user, validated } = this.state;
        validated['username'] = (!(this.usernameRef.current.invalid.length > 0) && user.username !== "");
        validated['email'] = (!(this.emailRef.current.invalid.length > 0) && user.email !== "");
        validated['password'] = (!(this.passwordRef.current.invalid.length > 0) && user.password !== "");
        validated['repeatPassword'] = (!(this.repeatPasswordRef.current.invalid.length > 0) && user.repeatPassword !== "");
        this.setState({ validated });

        if(validated.username && validated.email && validated.password && validated.repeatPassword) {
            this.setState({disabled: false});
        } else {
            this.setState({disabled: true});
        }
    }

    handleError = () => {
        this.setState({ disabled: true });
    };
 
    handleSubmit = () => {
        // do nothing per requirements
    }

    componentDidMount() {
        // custom rule to check if repeat password field matches password field
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== this.state.user.password) {
                return false;
            }
            return true;
        });

        // custom rule to check if username is more than 15 characters
        ValidatorForm.addValidationRule('isValidUsername', (value) => {
            if(value.length > 15) {
                return false;
            }
            return true;
        });
    }
 
    componentWillUnmount() {
        // remove rule when it is not needed
        ValidatorForm.removeValidationRule('isPasswordMatch');
        ValidatorForm.removeValidationRule('isValidUsername');
    }
 
    render() {
        const { user, disabled } = this.state;
        return (
            <ValidatorForm
                ref={this.formRef}
                onSubmit={this.handleSubmit}
                onError={this.handleError}
                instantValidate={false}
            >
                <Box className="centered">
                    <TextValidator
                        label="Username"
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        ref={this.usernameRef}
                        variant="outlined"
                        name="username"
                        value={user.username}
                        validatorListener={this.validatorListener}
                        validators={['required', 'isValidUsername']}
                        errorMessages={['this field is required', 'max 15 characters']}
                    />
                </Box>
                <Box className="centered">
                    <TextValidator
                        label="Email"
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        ref={this.emailRef}
                        variant="outlined"
                        name="email"
                        value={user.email}
                        validatorListener={this.validatorListener}
                        validators={['required', 'isEmail']}
                        errorMessages={['this field is required', 'email is not valid']}
                    />
                </Box>
                <Box className="centered">
                    <TextValidator
                        label="Password"
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        ref={this.passwordRef}
                        variant="outlined"
                        name="password"
                        type="password"
                        validatorListener={this.validatorListener}
                        validators={['required']}
                        errorMessages={['this field is required']}
                        value={user.password}
                    />
                </Box>
                <Box className="centered">
                    <TextValidator
                        label="Repeat password"
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        ref={this.repeatPasswordRef}
                        variant="outlined"
                        name="repeatPassword"
                        type="password"
                        validatorListener={this.validatorListener}
                        validators={['isPasswordMatch', 'required']}
                        errorMessages={['password fields do not match', 'this field is required']}
                        value={user.repeatPassword}
                    />
                </Box >
                <Box className="centered">
                    <Button variant="outlined" disabled={disabled} type="submit">Submit</Button>
                </Box>
            </ValidatorForm>
        );
    }
}
 