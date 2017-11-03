import React, {Component} from 'react';
import {Link, Redirect, Route} from 'react-router';
import {Container,Button,Form} from 'semantic-ui-react';
import HeaderComponent from './Header';

class SignIn extends Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      email : '',
      password : '',
      status : 'signIn'
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick = (e) => {
    this.setState({status: 'check'})
    let url = 'http://localhost:3000/users?email=' + this.state.email;
    fetch(url).then(res => {
      if(res.ok){
        return res.json()
      }
    }).then(data => {
      if(data != undefined){
        if(data[0].email == this.state.email && data[0].password == this.state.password){
          sessionStorage.setItem('userId', data[0].id)
          setTimeout(() => this.setState({status: 'success'}), 1000)
        }
        }else{
          this.setState({status: 'fail'})
      }
    })
  }

  handleChange = (e) => {
    const name = e.target.name;
    this.setState({[name]: e.target.value});
  }

  buildButton(){
    let content;
    let status = this.state.status;
    if(status == 'signIn'){
      content = <Button type='submit' onClick={this.handleClick.bind(this)}>SignIn</Button>
    }
    if(status == 'check'){
      content = <Button loading>Loading</Button>
    }
    if(status == 'success'){
      content = <Link to='app' ><Button>Success</Button></Link>
    }
    if(status == 'fail'){
      content = <div>
        <p>Looks like something went wrong, please try again</p>
        <Button type='submit' onClick={this.handleClick.bind(this)}>SignIn</Button>
      </div>
    }
    return content;
  }

  buildForm(){
    return <Form>
      <Form.Field>
        <label>Email</label>
        <input name='email' placeholder="email" onChange={this.handleChange}/>
      </Form.Field>
      <Form.Field>
        <label>Password</label>
        <input name='password' type='password' placeholder='password' onChange={this.handleChange}/>
      </Form.Field>
      {this.buildButton()}
    </Form>
  }

  render() {
    return (
      <Container textAlign='center'>
        {this.buildForm()}
      </Container>
    )
  }
}

export default SignIn