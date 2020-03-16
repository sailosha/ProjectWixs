// Dependencies
import React, { Component } from "react";
import { Container, Button, Card, CardDeck, CardImg } from "react-bootstrap";
import axios from "axios";
import auth from "/auth.js";
import qs from "qs"; // for packaging details collected from the form

// CSS/SASS
import "./sass/DashboardPage.scss";
import CustomCard from "./CustomCard";

const GET_TEMPLATES_URL =
  "http://cosc.brocku.ca/~c4f00g02/projectWixs/templateFetch.php";
const GET_USER_URL = "http://cosc.brocku.ca/~c4f00g02/projectWixs/getUser.php";

/**
 * Purpose: This is a file containing...
 */
export default class DashboardPage extends Component {
  constructor(props) {
    super(props);

    var currentUser = auth.getCookie("user");

    this.state = {
      email: currentUser,
      first_name: "",
      last_name: "",
      admin: false, // if user is admin, display link to admin page
      templateArray: []
    };

    this.getUser = this.getUser.bind(this);
    this.getTemplates = this.getTemplates.bind(this);
    
  }

  /**
   * Obtains the user details from the database
   */
  getUser() {
    const params = {
      email: this.state.email
    };

    axios
      .post(GET_USER_URL, qs.stringify(params))
      .then(response => {
        console.log(response);

        if (response.data["success"] === true) {
          // TODO: do something with the sent data here. Can set the first name in state so it can be displayed. Also display a link to the admin page if the user is an admin. This page will eventually be the only one showing links to admin page and editor page so they can be removed from nav bar
        } else {
          console.log(response.data["message"]);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  /**
   * Obtains the user's templates from the database
   */
  getTemplates() {
    const params = {
      email: this.state.email
    };

    axios
      .post(GET_TEMPLATES_URL, qs.stringify(params))
      .then(response => {
        console.log(response);
        if (response.data["success"] === true) {
          this.setState({
            templateArray: response.data["templates"]
          });
        } else {
          console.log(response.data["message"]);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  /**
   * Executes when the component has rendered
   */
  componentDidMount() {
    this.getUser(); // get user from database which matches email from cookies
    this.getTemplates(); // get templates that belong to currently signed in user
    this.render();
  }



  render() {
    const isAuthenticated = auth.isAuthenticated();
    let greeting;

    if (isAuthenticated) {
      greeting = (
        <h1>
          Welcome <i>{this.state.email}</i> to your Dashboard!
        </h1>
      );
    } else {
      greeting = <h1>Hello asshole</h1>;
    }

    return (
      <div>
        <Container>
          <div className="word-content">{greeting}</div>
        </Container>

        <Container>
          <div className="template-selection">
            <a href="#/editor">
              <h2 className="editor-link">Your Templates</h2>
            </a>
            <CardDeck className="card-deck">
              {this.state.templateArray.map((template, i) => (
                <CustomCard template={template} key={i} />
              ))}
              <div id="all_cards"></div>
            </CardDeck>
          </div>
        </Container>
      </div>
    );
  }
}
