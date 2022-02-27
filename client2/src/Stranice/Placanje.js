import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import React, { Component } from "react";
import axios from 'axios';
import { Redirect } from "react-router-dom";
//let address = '192.168.0.106'
let address = '192.168.43.173'
export class Placanje extends React.Component {

    async componentDidMount() {
      //const imePrezime = this.props.location.pathname.slice(12).split(' ')
      const imePrezime = this.props.location.pathname.split('/')[2].split(' ')
      console.log(imePrezime)

    const { value: kolicina } = await Swal.fire({
        title: 'Unesite iznos',
        input: 'number',
        inputLabel: 'Iznos',
        inputPlaceholder: '2000'
      })
      
      if (kolicina) {
          
          const zaSlanje = { Ime: imePrezime[0], Prezime: imePrezime[1],Uplaceno:parseInt(kolicina)}
          axios.post('http://'+address+':5000/plati', zaSlanje);
          
         Swal.fire(`Uneti novac: ${kolicina}`);
         this.props.history.push('/')
      }else{
        console.log("greska")
      }


    }

    render() {
        return(

            <div></div>
        )
    }
}
export default Placanje;