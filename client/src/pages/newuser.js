import React, { Component } from "react";
import {
  generateMnemonicAndSeed,
  getAddressFromSeed,
  mnemonicToSeed,
} from "../utils/wallet";
import { Route, Link, BrowserRouter as Router } from "react-router-dom";
import * as solanaWeb3 from "@solana/web3.js";
import * as crypto from "crypto";
import * as bs from "bs58";

import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";


import axios from '../components/Chatscreen/axios';

const styles = (theme) => ({
  root: {
    display: "flex",
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
    justifyContent: "center",
    alignItems: "center",
  },
});

class newuser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mnemonic: {},
      isdownladed: true,
      publicaddress: "",
      privateaddress: "",
      name: "",
      password: "",
    };
  }

  async componentDidMount() {
    const mnemonic = await generateMnemonicAndSeed();
    this.setState({ mnemonic: mnemonic });
    //(this.state.mnemonic);
    const seed = await mnemonicToSeed(this.state.mnemonic.mnemonic);
    //(seed);
    const address = await getAddressFromSeed(seed);
    this.setState({ publicaddress: address.publicKey.toString() });
    this.setState({ privateaddress: address.secretKey });
    var pk = new solanaWeb3.Account(this.state.privateaddress);
    //(pk);
  }

  downloadMnemonic = (mnemonic) => {
    const url = window.URL.createObjectURL(new Blob([mnemonic]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "paysol.bak");
    document.body.appendChild(link);
    link.click();
    this.setState({ isdownladed: false });
  };

  savetolocalstorage = () => {
    // var crypto = require("crypto");
    // var id = crypto.randomBytes(4).toString("hex");
    // var name = this.state.name + "#" + id;
    localStorage.setItem("secretkey", bs.encode(this.state.privateaddress));
    localStorage.setItem("name", this.state.name);
    localStorage.setItem("password", this.state.password);
    let body = {
      _id: this.state.publicaddress,
      username: this.state.name,
      password: this.state.password,
      conversationId: []
    };
    //(body);

    axios.post('/user/new', body)
      .then(response => {
        // //(response.data)
        this.props.history.push("/chat");
      });

  };

  handleChange = (event) => {
    this.setState({ name: event.target.value });
  };
  handleChange1 = (event) => {
    this.setState({ password: event.target.value });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            {this.state.isdownladed ? (
              <div style={{ justifyContent: "center" }}>
                <Typography component="h1" variant="h4" align="center">
                  PaySol
                </Typography>
                <Typography variant="h6" align="center" paragraph>
                Pay and get paid with crypto <br/>
                Download and keep the key safe for future use
                </Typography>
                <TextField
                  id="outlined-multiline-static"
                  multiline
                  rows={4}
                  defaultValue={this.state.mnemonic.mnemonic}
                  variant="outlined"
                  fullWidth
                  disabled
                />

                <div style={{ textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: 20 }}
                    onClick={() => {
                      this.downloadMnemonic(this.state.mnemonic.mnemonic);
                    }}
                  >
                    Download Key
                  </Button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="body2" gutterBottom>
                      Address : {this.state.publicaddress}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      id="outlined-required"
                      label="User name"
                      defaultValue={this.state.name}
                      variant="outlined"
                      onChange={this.handleChange}
                      helperText="Type anonymous name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      id="outlined-required"
                      type="password"
                      label="Password"
                      defaultValue={this.state.password}
                      variant="outlined"
                      onChange={this.handleChange1}
                    />
                  </Grid>
                </Grid>

                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: 20 }}
                    onClick={() => {
                      this.savetolocalstorage();
                    }}
                  >
                    continue
                  </Button>
                </div>
              </div>
            )}
          </Paper>
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(newuser);
