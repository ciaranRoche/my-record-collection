import React, {Component} from 'react';
import {Link} from 'react-router';
import {Container, Image, Grid, Segment, Rail, Sticky, Header, Icon, Feed, Form, TextArea, Radio, Button} from 'semantic-ui-react';
import vinylApi from '../API/vinylAPI';
import Loading from './Loading';



class Album extends Component{
  constructor(props){
    super(props);
    this.state = {
      id : '',
      artist : '',
      album : '',
      image : '',
      genre : '',
      year : '',
      notes : '',
      likes : 0,
      reviews : [],
      user : [],
      userReview : ''
    }
    this.handleReview = this.handleReview.bind(this);
    this.handleSubmitReview = this.handleSubmitReview.bind(this);
  }

  componentDidMount(){
    let link = 'http://localhost:3000/vinyl/' + this.props.params.id
    fetch(link).then(res => {
      if (res.ok)
        return res.json()
    }).then(data => {
      if (data!=null){
        this.setState({
          id : data.id,
          artist : data.artist,
          album : data.album,
          image : data.image,
          genre : data.genre,
          year : data.year,
          notes : data.notes,
          likes : data.likes,
          reviews : data.reviews
        });
      };
    }).then(() => {
      if(sessionStorage.getItem('userId') != null){
      fetch('http://localhost:3000/users/' + sessionStorage.getItem('userId')).then(res => {
        if(res.ok)
          return res.json()
      }).then(data => {
        if(data!=null){
          console.log(data)
          this.setState({
            user: data
          })
        }
      })
    }
  });
}

  handleReview(e){
    this.setState({userReview: e.target.value})
  }

  handleSubmitReview(e){
    e.preventDefault();
    let d = new Date();
    let date = d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear();
    let newReview = {
      "user": this.state.user.id, 
      "name" : this.state.user.firstname, 
      "date" : date, 
      "image" : this.state.user.profile_image,
      "summary" : this.state.userReview
    }
    this.state.reviews.push(newReview)
    vinylApi.addReview(this.state.reviews, this.state.id)
    this.setState({
      userReview: ''
    })
  }

  leaveReview(){
    let content;
    if(sessionStorage.getItem('userId') == null){
      content = <div></div>
    }else{
      content = <div>
        <Form>
          <Form.Field control={TextArea} label='Leave A Review' placeholder='Tell us if you like the album...' onChange={this.handleReview} />
          <Button onClick={this.handleSubmitReview}>Submit</Button>
        </Form>
      </div>
    }
    return content
  }

  buildReviews(){
    let content;
    if(this.state.reviews.length == 0){
      content = <div></div>
    }else{
      content = <div>
        <h3>Reviews</h3>
        <Feed events={this.state.reviews} />
      </div>
    }
    return content
  }

  render(){
    return(
      <div>
        <Container>
          <Grid stackable>
            <Grid.Row>
              <Grid.Column width={10}>
                <Image fluid src={this.state.image}/>
              </Grid.Column>
              <Grid.Column width={6}>
                <Header as='h1'>
                  {this.state.artist}
                  <Header.Subheader>
                    {this.state.album}
                  </Header.Subheader>
                </Header>
                  <p><b>Genre : </b>{this.state.genre}</p>
                  <p><b>Released : </b>{this.state.year}</p>
                  <p><b>About : </b>{this.state.notes}</p>
                  <p><b>Likes : </b>{this.state.likes}</p>
                  {this.buildReviews()}
                  {this.leaveReview()}
              </Grid.Column>
            </Grid.Row>
            
          </Grid>
        </Container>
      </div>
    )
  }
}

export default Album;