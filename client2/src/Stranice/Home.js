import Autosuggest from 'react-autosuggest';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import logo from '../scolio_log.jpg';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

//let address = '192.168.0.106'
let address = '192.168.43.173'

var languages = [];
var isteklaGrupa = [];
var isticeGrupa = [];
  const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    
    // console.log(languages[0].toLowerCase().slice(0, inputLength))
    // console.log(inputValue)
    return inputLength === 0 ? [] : languages.filter(lang =>
      lang.toLowerCase().includes(inputValue)
    );
  };

  // When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div>
    {suggestion}
  </div>
);
const postojiKorisnik = (korisnik) =>{ 
  console.log(languages.includes(korisnik))
  return languages.includes(korisnik)
}

export class Home extends React.Component {
    constructor() {
      super();
  
      // Autosuggest is a controlled component.
      // This means that you need to provide an input value
      // and an onChange handler that updates this value (see below).
      // Suggestions also need to be provided to the Autosuggest,
      // and they are initially empty because the Autosuggest is closed.
      this.state = {
        value: '',
        suggestions: [],
        isteklaGrupa: [],
        isticeGrupa:[]
      };
     // const classes = useStyles();
    }

    componentDidMount(){

      fetch("http://"+address+":5000/vratiNizStringova")
        .then(res => res.json())
        .then(
          (result) => {
           // console.log(result)
            languages = result
            //  this.setState({
            //    languages: result

            //  });
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            // this.setState({
            //   languages: null
            // });
          }
        )

        fetch("http://"+address+":5000/vratiIsticeGrupa")
        .then(res => res.json())
        .then(
          (result) => {
            //console.log(result)
            //isticeGrupa = result
            
            this.setState({
            
              isticeGrupa: result
  
                });
          },

          (error) => {

          }
        )

        fetch("http://"+address+":5000/vratiIsteklaGrupa")
        .then(res => res.json())
        .then(
          (result) => {
         
            this.setState({
            
              isteklaGrupa: result
  
                });
          },

          (error) => {

          }
        )

    }

    onChange = (event, { newValue }) => {
        this.setState({
          value: newValue
        });
      };

        // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {

    this.setState({
      suggestions: getSuggestions(value)
    });
  };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
          suggestions: []
        });
      };

      onClickTestiranja(){ console.log("KLIK") }
      onClickIndividualni = () =>{ }

      onClickEvidencija = () =>{ }
      placanjeKlik =async()=>{
        const { value: kolicina } = await Swal.fire({
          title: 'Unesite iznos',
          input: 'text',
          inputLabel: 'Iznos',
          inputPlaceholder: '2000'
        })
        
        if (kolicina) {
            console.log(kolicina)
          Swal.fire(`Unet datum: ${kolicina}`)
        }else{
          console.log("greska")
        }
      }
      onPretrazi = () =>{


        // <a class="btn btn-primary btn-lg" href="http://localhost:3000/testiranje/`+this.state.value+`">Testiranja</a>
        if(this.state.value !== ""){
          if(postojiKorisnik(this.state.value)){
          
        Swal.fire({
          title: "Sta zelite da prikazete?",
          icon: "info",
          showConfirmButton: false,
          showCloseButton: true,
          html:`
          <div>
            <div class='terminBtn'>
            <a class="btn btn-danger btn-lg" href="http://`+address+`:3000/upisivanje/`+this.state.value+`">Upisivanje</a>
            </div>

            <div class='terminBtn'>
            <a class="btn btn-info btn-lg" href="http://`+address+`:3000/placanje/`+this.state.value+`">Placanje</a>
            </div>

            <div class='terminBtn'>
            <a class="btn btn-secondary btn-lg" href="http://`+address+`:3000/evidencija/`+this.state.value+`">Evidencija</a>
            </div>
           </div>
          `
        });
      }else{
        Swal.fire({
          title: 'Da li ste sigurni da hocete da kreirate korisnika ' + this.state.value ,
          showDenyButton: true,
          confirmButtonText: `Da`,
          denyButtonText: `Ne`,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            let imePrezime = this.state.value.split(' ')
            console.log(imePrezime)
            const zaSlanje = { Ime: imePrezime[0], Prezime: imePrezime[1]}
            axios.post('http://'+address+':5000/createKorisnik', zaSlanje).catch(function(error){console.log(error)})
            Swal.fire('Kreiran!', '', 'success')
    
          } else if (result.isDenied) {
            Swal.fire('Nalog nije kreiran', '', 'info')
          }
        })
      }
      }
	
	

	}
      

      render() {
        const { value, suggestions } = this.state;

        // Autosuggest will pass through all these props to the input.
        const inputProps = {
          placeholder: 'Unesite ime ',
          value,
          onChange: this.onChange
        };

            // Finally, render it!
    return (

       <div class='holder'>
           <img class='logo' src={logo}></img>
      <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
        <Button className='pretraziBtn' variant="btn btn-outline-light btn-lg" onClick={this.onPretrazi} >Pretrazi</Button>{' '}
    
       
        <div class="container mt-3">
         <h2 className='isticeNaslov'>Istice grupa uskoro</h2>
         <ul class="list-group mlist">
            {/* <li class="list-group-item list-group-item-warning">Aleksandar Mitrovic   <div><span class="badge badge-pill badge-primary">2 Treninga</span></div></li>
            <li class="list-group-item list-group-item-warning">Petar Peric  <div><span class="badge badge-pill badge-primary">3 Treninga</span></div></li>
            <li class="list-group-item list-group-item-warning">Marko Markovic  <div><span class="badge badge-pill badge-primary">1 Treninga</span></div> </li>
            <li class="list-group-item list-group-item-warning">Jovan Jovic  <div><span class="badge badge-pill badge-primary">1 Treninga</span></div></li>
            <li class="list-group-item list-group-item-warning">Jovan Jovic  <div><span class="badge badge-pill badge-primary">4 Treninga</span></div></li> */}
             {
          this.state.isticeGrupa.map((item)=>{
            return (
              <li class="list-group-item list-group-item-warning">{item.Ime + " " + item.Prezime}<div><span class="badge badge-pill badge-primary">{item.brojPreostalihTreninga + " Treninga"}</span></div></li>
            )
          })

        }
         </ul>
         </div>

         <div class="container mt-3">
           
            <h2 className='isticeNaslov'>Istekla grupa</h2>
            <ul class="list-group mlist">
           { this.state.isteklaGrupa.map((item)=>{
                return (
                  <li class="list-group-item list-group-item-danger">{item.Ime + " " + item.Prezime}<div><span class="badge badge-pill badge-primary">{item.brojPreostalihTreninga + " Treninga"}</span></div></li>
                )
              })
          }
            </ul>

        </div>


       </div>
  
      );
    }
  }
  export default Home;
