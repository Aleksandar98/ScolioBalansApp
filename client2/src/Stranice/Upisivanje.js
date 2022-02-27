import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import React, { Component } from "react";
import axios from 'axios';

import logo from '../scolio_log.jpg';
let imePrezime;


//let address = '192.168.0.106'
let address = '192.168.43.173'

const klik =(cena,tip,trenutnaGrupa,brTreninga)=>{

  Swal.fire({
      title: 'Da li ste sigurni da hocete da upisete ' + tip + ' po ceni ' + cena +' dinara',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Save`,
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire('Saved!', '', 'success')


        let isDrugiClan = tip.includes('drugog')

        if(brTreninga<1){
          //BIRA SE NOVA GRUPA
          console.log(tip.split('Grupni')[1])
          let izabraniBrojTreninga;
          if(isDrugiClan)
          izabraniBrojTreninga = tip.split('Grupni')[1].split(' ')[0]
          else
          izabraniBrojTreninga = tip.split('Grupni')[1];
          const zaSlanje = { Ime: imePrezime[0], Prezime: imePrezime[1],Suma:cena,izabraniBrojTreninga:izabraniBrojTreninga,isDrugiClan:isDrugiClan}
          axios.post('http://'+address+':5000/kreirajNovuGrupu', zaSlanje).catch(function(error){console.log(error)})
          //treba da se updejtuje trenutnoAktivnaGrupa sa tip(to je ono sto je kliknuo)
          //treba da mu se dodaju prazna polja u kalendar zuta
        }else{
          //KLASICNO UPISIVANJE
          console.log(" NE PRAVIM GRUPU")
        if(tip === 'Testiranje'){
          const zaSlanje = { Ime: imePrezime[0], Prezime: imePrezime[1], Suma : cena}
          axios.post('http://'+address+':5000/dodajTestDatum', zaSlanje)

        }

        if(tip.includes('Individualni')){
          // var result = tip.split('Individualni')
          // if(result[1].includes("za drugog clana")){
          //   //za drugog clana
          //   const zaSlanje = { Ime: imePrezime[0], Prezime: imePrezime[1], Suma : cena}
          //   axios.post('http://localhost:5000/dodajIndividualniDatum', zaSlanje)
          // }else{
          //   // nije za drugog
          // }
          const zaSlanje = { Ime: imePrezime[0], Prezime: imePrezime[1], Suma : cena,daLiCustomTrening:false}
          axios.post('http://'+address+':5000/dodajIndividualniDatum', zaSlanje)

        }

        if(tip.includes('Grupni')){
          // var result = tip.split('Grupni')
          // if(result[1].includes("za drugog clana")){
          //   //za drugog clana
          //   const zaSlanje = { Ime: imePrezime[0], Prezime: imePrezime[1], Suma : cena}
          //   axios.post('http://localhost:5000/dodajGrupniDatum', zaSlanje)
          // }else{
          //   // nije za drugog
          // }
          const zaSlanje = { Ime: imePrezime[0], Prezime: imePrezime[1]}
          axios.post('http://'+address+':5000/dodajGrupniDatum', zaSlanje)

        }
        
      }
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
}
const generisiDugme = (ceoObjekat,cena,tip,tekst)=>{
  let brTreninga = ceoObjekat.brojPreostalihTreninga;
  let trenutnaGrupa = ceoObjekat.trenutnoAktivnaGrupa;

  let isCorrectGroup = false;
  if(trenutnaGrupa.split('_').length>1){
    if(tip.includes( trenutnaGrupa.split('_')[0]) && tip.includes('drugog'))
    isCorrectGroup = true;
  }else{
    if(tip.includes( trenutnaGrupa.split('_')[0])&& !tip.includes('drugog'))
    isCorrectGroup = true;
  }


  if(brTreninga>0 && !isCorrectGroup)
  return(
    <Button onClick={()=>{klik(cena,tip,trenutnaGrupa,brTreninga)}} className='upisivanjeDugme' variant="primary" disabled>{tekst}</Button>
  )
  else 
  return(
    <Button onClick={()=>{klik(cena,tip,trenutnaGrupa,brTreninga)}} className='upisivanjeDugme aktivnoDugme'  variant="primary"  >{tekst}</Button>
  )
}
const postojiKreiranCustomTrening = (cenaCustomIndividualni)=>{
 // if(cenaCustomIndividualni<0 || cenaCustomIndividualni == undefined)
 if(cenaCustomIndividualni<0)
  return false;
  else return true;
}
const klikIndvCustom = async (ceoObjekat)=>{
  console.log(ceoObjekat)
  if(postojiKreiranCustomTrening(ceoObjekat.cenaCustomIndividualni)){

    const zaSlanje2 = { Ime: imePrezime[0], Prezime: imePrezime[1],Suma:parseInt(ceoObjekat.cenaCustomIndividualni)}
    axios.post('http://'+address+':5000/dodajIndividualniDatum', zaSlanje2);
  }else{
    const { value: kolicina } = await Swal.fire({
      title: 'Unesite iznos Individualnog treninga',
      input: 'number',
      inputLabel: 'Iznos',
      inputPlaceholder: '2000'
    })
    
    if (kolicina) {

        const zaSlanje = { Ime: imePrezime[0], Prezime: imePrezime[1],Suma:parseInt(kolicina)}
        axios.post('http://'+address+':5000/zapamtiCustomTrening', zaSlanje);
      
        const zaSlanje2 = { Ime: imePrezime[0], Prezime: imePrezime[1],Suma:parseInt(kolicina)}
        axios.post('http://'+address+':5000/dodajIndividualniDatum', zaSlanje2);
        
       Swal.fire(`Uneti novac: ${kolicina} i zapamcen custom trening`);
    }else{
      console.log("greska")
    }
  }

}
const klikGrupniCustom = (brTreninga)=>{
  if(brTreninga<1){
    //Kreira se grupa
    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Dalje &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2']
    }).queue([
      {
        title: 'Broj treninga',
        text: 'Koliko treninga nedeljno'
      },
      'Kolika je cena jednog treninga'
    ]).then((result) => {
      if (result.value) {
        const brTreningaString = result.value[0]
        const sumaString = result.value[1]

        console.log()

       const zaSlanje = { Ime: imePrezime[0], Prezime: imePrezime[1],Suma:parseInt(sumaString) ,izabraniBrojTreninga:parseInt(brTreningaString),isDrugiClan:false}
        axios.post('http://'+address+':5000/kreirajNovuGrupu', zaSlanje).catch(function(error){console.log(error)})

        const zaSlanje2 = { Ime: imePrezime[0], Prezime: imePrezime[1],Suma:parseInt(sumaString) ,izabraniBrojTreninga:parseInt(brTreningaString)}
        axios.post('http://'+address+':5000/zapamtiCustomGrupni', zaSlanje2).catch(function(error){console.log(error)})
      }
    })
  }else{
    //Samo se zabelezi
    const zaSlanje = { Ime: imePrezime[0], Prezime: imePrezime[1]}
    axios.post('http://'+address+':5000/dodajGrupniDatum', zaSlanje)
  }

}
const  klikTestCustom = async ()=>{

  const { value: kolicina } = await Swal.fire({
    title: 'Unesite iznos Testiranja',
    input: 'number',
    inputLabel: 'Iznos',
    inputPlaceholder: '2000'
  })
  
  if (kolicina) {
      
      const zaSlanje = { Ime: imePrezime[0], Prezime: imePrezime[1],Suma:parseInt(kolicina)}
      axios.post('http://'+address+':5000/dodajTestDatum', zaSlanje);
      
     Swal.fire(`Uneti novac: ${kolicina}`);
  }else{
    console.log("greska")
  }
}
const promeniCustomCenu = async()=>{
  const { value: kolicina } = await Swal.fire({
    title: 'Unesite iznos Individualnog treninga',
    input: 'number',
    inputLabel: 'Iznos',
    inputPlaceholder: '2000'
  })
  
  if (kolicina) {

      const zaSlanje = { Ime: imePrezime[0], Prezime: imePrezime[1],Suma:parseInt(kolicina)}
      axios.post('http://'+address+':5000/zapamtiCustomTrening', zaSlanje);

     Swal.fire(`Zapamcen custom trening`);
  }else{
    console.log("greska")
  }
}
const vratiCustomCenu = (cenaCustomIndividualni)=>{
  if(cenaCustomIndividualni > 0)
  return(<a href="#" onClick={promeniCustomCenu}>( Cena: {cenaCustomIndividualni} din)</a>)
  else{
    return ("( Cena nije postavljena )")
  }
}

const vratiCustomCenuGrupni = (cenaCustomGrupni)=>{
  if(cenaCustomGrupni != "0_0"){
    let brTreninga = cenaCustomGrupni.split("_")[0]
    let cenaTreninga = cenaCustomGrupni.split("_")[1]
  return(brTreninga+" Treninga po ceni od " +cenaTreninga)
  }else{
    return ("( Nije postavljeno )")
  }
}
const generisiCustomGrupniDugme =(ceoObjekat) =>{

  return(
    <div>
      <Button onClick={()=>{klikGrupniCustom(ceoObjekat.brojPreostalihTreninga)}} className='upisivanjeDugme' variant="primary">Grupni Custom</Button> {vratiCustomCenuGrupni(ceoObjekat.cenaCustomGrupni)}

    </div>
     )
}
export  class Upisivanje extends React.Component{

  constructor() {
    super();



    this.state = {
      ceoObjekat: null,
    };
  
  }

  componentDidMount(){
    const imePrezime = this.props.location.pathname.split('/')[2].split(' ')
    const zaPretragu = imePrezime[0]+'_'+imePrezime[1]

    fetch("http://"+address+":5000/vratiCeoObjekat/"+zaPretragu)
    .then(res => res.json())
    .then(
      (result) => {

     
         this.setState({
          ceoObjekat: result

         });

      },

      (error) => {

      }
    )
    
  }

    render() {
       imePrezime = this.props.location.pathname.split('/')[2].split(' ')
      if(this.state.ceoObjekat!=null)
    return (
      <div className='testiranjeDiv'>
                               <div  className='holderNew'>
                  <img className='imgLogo' src={logo}></img>
                  <div className='individualniHeader'>
      
                  {/* <ArrowLeftCircleFill className='backInd' color="royalblue" size={32} /> */}
                  <label className='individualniNaslov'>Upisivanje</label>
                </div>
                    </div>

                <p className='testiranjeOpis'>Ime i prezime:</p>
                <p className='testiranjeIme'>{imePrezime[0] + " " + imePrezime[1]}</p>

                <p className='upisivanjeNaslov'>Testiranje</p>
                <Button onClick={()=>{klik(2000,"Testiranje")}} className='upisivanjeDugme' variant="primary">Testiranje</Button>{' '}
                <Button onClick={()=>{klikTestCustom(2000,"Testiranje")}} className='upisivanjeDugme' variant="primary">Custom Testiranje</Button>{' '}

                <div>
                <p className='upisivanjeNaslov'>Individualni</p>
                <Button onClick={()=>{klik(2000,"Individualni")}} className='upisivanjeDugme' variant="primary">Individualni</Button>{' '}
                <Button onClick={()=>{klik(1500,"Individualni za drugog clana")}} className='upisivanjeDugme' variant="primary">Individualni 2. clan porodice</Button>{' '}
                <Button onClick={()=>{klikIndvCustom(this.state.ceoObjekat)}} className='upisivanjeDugme' variant="primary">Individualni Custom {}</Button>{' '}{vratiCustomCenu(this.state.ceoObjekat.cenaCustomIndividualni)}
                </div>

                <div>
                <p className='upisivanjeNaslov'>Grupni</p>
                {generisiDugme(this.state.ceoObjekat,900,"Grupni1","Grupni 1 Nedeljno")}
                {generisiDugme(this.state.ceoObjekat,540,"Grupni1 za drugog clana","Grupni 1 Nedeljno 2. clan porodice")}
                {/* <Button onClick={()=>{klik("?","Grupni1 za drugog clana")}} className='upisivanjeDugme' variant="primary">Grupni 1 Nedeljno 2. clan porodice</Button>{' '} */}
                <div>
                {generisiDugme(this.state.ceoObjekat,750,"Grupni2","Grupni 2 Nedeljno")}
                {generisiDugme(this.state.ceoObjekat,450,"Grupni2 za drugog clana","Grupni 2 Nedeljno 2. clan porodice")}

                {/* <Button onClick={()=>{klik(750,"Grupni2")}} className='upisivanjeDugme' variant="primary">Grupni 2 Nedeljno</Button>{' '}
                <Button onClick={()=>{klik(450,"Grupni2 za drugog clana")}} className='upisivanjeDugme' variant="primary">Grupni 2 Nedeljno 2. clan porodice</Button>{' '} */}

                </div>
                
                <div>

                {generisiDugme(this.state.ceoObjekat,660,"Grupni3","Grupni 3 Nedeljno")}
                {generisiDugme(this.state.ceoObjekat,400,"Grupni3 za drugog clana","Grupni 3 Nedeljno 2. clan porodice")}
                {/* <Button onClick={()=>{klik(660,"Grupni3")}} className='upisivanjeDugme' variant="primary">Grupni 3 Nedeljno</Button>{' '} */}
                {/* <Button onClick={()=>{klik(400,"Grupni3 za drugog clana")}} className='upisivanjeDugme' variant="primary">Grupni 3 Nedeljno 2. clan porodice</Button>{' '} */}
                </div>

                <div>
                {generisiDugme(this.state.ceoObjekat,625,"Grupni4","Grupni 4 Nedeljno")}
                {generisiDugme(this.state.ceoObjekat,375,"Grupni4 za drugog clana","Grupni 4 Nedeljno 2. clan porodice")}
                {/* <Button onClick={()=>{klik(625,"Grupni4")}} className='upisivanjeDugme' variant="primary">Grupni 4 Nedeljno</Button>{' '}
                <Button onClick={()=>{klik(375,"Grupni4 za drugog clana")}} className='upisivanjeDugme' variant="primary">Grupni 4 Nedeljno 2. clan porodice</Button>{' '} */}
                </div>


                <div>
                {generisiDugme(this.state.ceoObjekat,550,"Grupni5","Grupni 5 Nedeljno")}
                {generisiDugme(this.state.ceoObjekat,330,"Grupni5 za drugog clana","Grupni 5 Nedeljno 2. clan porodice")}
                {/* <Button onClick={()=>{klik(550,"Grupni5")}} className='upisivanjeDugme' variant="primary">Grupni 5 Nedeljno</Button>{' '}
                <Button onClick={()=>{klik(330,"Grupni5 za drugog clana")}} className='upisivanjeDugme' variant="primary">Grupni 5 Nedeljno 2. clan porodice</Button>{' '} */}
                </div>
                {generisiCustomGrupniDugme(this.state.ceoObjekat)}
               
                </div>

      </div>
      );
      else
      return(<div></div>)
    }
}
export default Upisivanje;