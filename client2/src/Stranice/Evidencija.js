import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup'
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../scolio_log.jpg';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert'
var _ = require('lodash');


//let address = '192.168.0.106'
let address = '192.168.43.173'

let pdfFile;



const listaKlik =(ime,prezime,datumKliknut,isGrupni)=>{
  Swal.fire({
      title: 'Opcije za termin',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Izmeni`,
      denyButtonText: `Obrisi`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
          const { value: datum } = await Swal.fire({
              title: 'Unesite datum za izmenu',
              input: 'text',
              inputLabel: 'Datum',
              inputPlaceholder: 'Novi datum'
            })
            
            if (datum) {
                //UPDEJTUJ
                 const zaSlanje = { Ime: ime, Prezime:prezime,datumKliknut:datumKliknut,Datum:datum,isGrupni:isGrupni}
                 axios.post('http://'+address+':5000/izmeniDatum', zaSlanje)
              Swal.fire(`Unet datum: ${datum}`)
            }else{
              console.log("greska")
            }
      } else if (result.isDenied) {

          Swal.fire({
            title: 'Da li je ovo termin za drugo dete',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: `Da`,
            denyButtonText: `Ne`,
          }).then( async (result) => {

            const { value: grupa } = await Swal.fire({
              title: 'Unesite koliko puta je imao clan treninge nedeljno u toj grupi',
              input: 'text',
              inputLabel: 'Broj treninga nedeljno (za individualne stavite 0)',
              inputPlaceholder: '3'
            })
            
            if (grupa) {
              if (result.isConfirmed) {
                const zaSlanje = { Ime: ime, Prezime:prezime,datumKliknut:datumKliknut,isGrupni:isGrupni,drugoDete:true,grupaZaBrisanje:grupa}
                axios.post('http://'+address+':5000/deleteDatum', zaSlanje)
                Swal.fire('Termin obrisan', '', 'success')
              }else{
                const zaSlanje = { Ime: ime, Prezime:prezime,datumKliknut:datumKliknut,isGrupni:isGrupni,drugoDete:false,grupaZaBrisanje:grupa}
                axios.post('http://'+address+':5000/deleteDatum', zaSlanje)
                Swal.fire('Termin obrisan', '', 'success')
              }
            }else{
              console.log("greska")
            }




          })
        }
    })
}
const listaUplataKlik = (ime,prezime,datumKliknut,isGrupni)=>{
  Swal.fire({
    title: 'Opcije za uplatu',
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: `Izmeni`,
    denyButtonText: `Obrisi`,
  }).then(async (result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
        const { value: datumUplata } = await Swal.fire({
            title: 'Unesite datum sa uplatom za izmenu',
            input: 'text',
            inputLabel: 'Format: Datum_Uplata',
            inputPlaceholder: '01.01.2000_2000'
          })
          
          if (datumUplata) {

              const zaSlanje = { Ime: ime, Prezime:prezime,datumKliknut:datumKliknut,DatumUplata:datumUplata,isGrupni:isGrupni}
              axios.post('http://'+address+':5000/izmeniDatumUplata', zaSlanje)

            Swal.fire(`Unet datum i uplata: ${datumUplata}`)
          }else{
            console.log("greska")
          }
    } else if (result.isDenied) {

      const zaSlanje = { Ime: ime, Prezime:prezime,datumKliknut:datumKliknut,isGrupni:isGrupni}
      axios.post('http://'+address+':5000/deleteDatumUplata', zaSlanje)

      Swal.fire('Termin obrisan', '', 'success')
    }
  })
}

const listaPrazanKlik = (ime,prezime,grupaBr)=>{

  Swal.fire({
    title: 'Da li ste sigurni da hocete da Obrisete prazan termin ',
    showDenyButton: true,
    confirmButtonText: `Da`,
    denyButtonText: `Ne`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      const zaSlanje = { Ime: ime, Prezime:prezime,datumKliknut:"01.01.9999_"+grupaBr}
      axios.post('http://'+address+':5000/deletePrazanTermin', zaSlanje)
      Swal.fire('Termin obrisan', '', 'success')

    } else if (result.isDenied) {
      Swal.fire('Termin nije obrisan', '', 'info')
    }
  })



}

const dodajOpisGrupi = (ime,prezime,grupaBr)=>{
  const zaSlanje = { Ime: ime, Prezime:prezime,brGrupe:grupaBr,isGrupni:true,opisGrupe:"test11"}
  axios.post('http://'+address+':5000/dodajOpisGrupi', zaSlanje)
}

const msort = (niz)=> {

  let i = 0;
  let j = 0;

  niz.sort((datum1ceo,datum2ceo)=>{

    let datum1 = datum1ceo.split('.')


    let dan1 = datum1[0]
    let mesec1 = datum1[1]
    let godina1 = datum1[2]  
    let grupaBr = godina1.split('_')[1]
    if(godina1.split('_').length>2){
      grupaBr = godina1.split('_')[2]
      godina1 = godina1.split('_')[0]
     
    }else
    godina1 = godina1.split('_')[0]
    let datumZaBroj1= parseInt(grupaBr+godina1+mesec1+dan1)
    let datumBroj1 = parseInt(datumZaBroj1)
   
    let datum2 = datum2ceo.split('.')
            
    let dan2 = datum2[0]
    let mesec2 = datum2[1]
    let godina2 = datum2[2]  
    let grupaBr2 = godina2.split('_')[1]
    if(godina2.split('_')>2){
      godina2 = godina2.split('_')[0]
      grupaBr2 = godina2.split('_')[2]
    }
    let datumZaBroj2= parseInt(grupaBr2+godina2+mesec2+dan2)

    let datumBroj2 = parseInt(datumZaBroj2)
   
    return(datumBroj1-datumBroj2)

  })
  //niz.reverse();
  return niz;
}

const generisi = (datumi) =>{


let nizObjekta=[];
datumi.map((datum) => {

  let datum1 = datum.split('.')
            
  let dan1 = datum1[0]
  let mesec1 = datum1[1]
  let godina1 = datum1[2]  

 
 
  if(godina1.split('_').length>2){

  
    
    let kolicina = godina1.split('_')[1]
    
    let grupaBr = godina1.split('_')[2]
    
    godina1 = godina1.split('_')[0]

   
    nizObjekta.push({godina:godina1,mesec:mesec1,dan:dan1,kolicina:kolicina,grupaBr:grupaBr})
  }else{
    let grupaBr = godina1.split('_')[1]
    godina1 = godina1.split('_')[0]
    if(godina1==="9999")
    nizObjekta.push({godina:"",mesec:"",dan:"",kolicina:null,grupaBr:grupaBr})
    else
    nizObjekta.push({godina:godina1,mesec:mesec1,dan:dan1,kolicina:null,grupaBr:grupaBr})
  }
  

})

   let res = _.groupBy(nizObjekta,'grupaBr')
   let rezultujuciNiz = []

   for (const property in res) {

    rezultujuciNiz.push(res[property])
  }
  return (rezultujuciNiz)


}

const obrisiKorisnika = (ime,prezime) =>{
  Swal.fire({
    title: 'Da li ste sigurni da hocete da Obrisete korisnika ' + ime + ' ' + prezime,
    showDenyButton: true,
    confirmButtonText: `Da`,
    denyButtonText: `Ne`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      const zaSlanje = { Ime: ime, Prezime:prezime}
      axios.post('http://'+address+':5000/deleteKorisnik', zaSlanje)
      Swal.fire('Obrisan!', '', 'success')

    } else if (result.isDenied) {
      Swal.fire('Nalog nije obrisan', '', 'info')
    }
  })

}

const daLiPlacenoTestiranje = (platioTestNum)=>{
  if(platioTestNum === undefined){
    return(
<p className='testiranjeNijePlaceno'>Nije Placeno</p>
    )
  }else{
    return(
<p className='testiranjePlaceno'>Placeno {platioTestNum}</p>
    )
  }
}

 const  vratiNovac = async (ime,prezime,tipVracanja)=>{

  const { value: kolicina } = await Swal.fire({
    title: 'Unesite iznos',
    input: 'number',
    inputLabel: 'Iznos',
    inputPlaceholder: '1000'
  })
  
  if (kolicina) {
      
      const zaSlanje = { Ime: ime, Prezime: prezime,Kolicina:parseInt(kolicina),TipVracanja:tipVracanja}
      axios.post('http://'+address+':5000/vratiNovac', zaSlanje);
      
     Swal.fire(`Uneti novac: ${kolicina}`);
  }else{
    console.log("greska")
  }

}

export class Evidencija  extends React.Component {

  constructor() {
    super();

    this.state = {
      ceoObjekat: null,
      nizGrupa: null,
      nizGrupaIndividualni: null
    };
  }

  componentDidMount(){
    const imePrezime = this.props.location.pathname.split('/')[2].split(' ')
    const zaPretragu = imePrezime[0]+'_'+imePrezime[1]

    let imeDokumenta = zaPretragu +".pdf"
    try {
      pdfFile = require('../' + imeDokumenta).default;
      
    } catch (error) {
      console.log("NARPRAVIET PDF PACIJENTA")
      
    }

    fetch("http://"+address+":5000/vratiCeoObjekat/"+zaPretragu)
    .then(res => res.json())
    .then(
      (result) => {
        let povratniNizGrupni=  msort(result.grupniDatumi)
        let povratniNizIndividualni=  msort(result.individualniDatumi)
        result.grupniDatumi = povratniNizGrupni
        result.individualniDatumi = povratniNizIndividualni
     
         this.setState({
          ceoObjekat: result

         });

      },

      (error) => {

      }
    )
  }
    render(){

      if(this.state.ceoObjekat != null ){
        if(this.state.nizGrupa == null){
          this.setState({ nizGrupa: generisi(this.state.ceoObjekat.grupniDatumi)})
        }
        if(this.state.nizGrupaIndividualni == null){
          this.setState({ nizGrupaIndividualni: generisi(this.state.ceoObjekat.individualniDatumi)})
        }
      }
      if(this.state.ceoObjekat != null && this.state.nizGrupa != null && this.state.nizGrupaIndividualni != null){
      return (
       

        <div>
            <div className='testiranjeDiv'>
                <div  className='holderNew'>
                  <img className='imgLogo' src={logo}></img>
                  <div className='individualniHeader'>
      
                  {/* <ArrowLeftCircleFill className='backInd' color="royalblue" size={32} /> */}
                  <label className='individualniNaslov'>Evidencija</label>
                </div>
                    </div>

                <p className='testiranjeOpis'>Ime i Prezime:</p>
                <p className='testiranjeIme'>{this.state.ceoObjekat.Ime + " " + this.state.ceoObjekat.Prezime}   <Button onClick={()=>{obrisiKorisnika(this.state.ceoObjekat.Ime,this.state.ceoObjekat.Prezime)}} className='upisivanjeDugme' variant="danger"  >Obrisi</Button></p>

                <Alert className="evidOstaloCard" variant="primary">
                Preostalo jos  
                 <span class="badge badge-pill badge-primary">{" "+this.state.ceoObjekat.brojPreostalihTreninga + " Treninga"}</span>
                  </Alert>
                  <p className='testiranjeT1'>Testiranja</p>
                  {this.state.ceoObjekat.testDatumi.map((datum,index)=>{
                    return(
                    <b>{datum } {daLiPlacenoTestiranje(this.state.ceoObjekat.testDatumPlacanja[index])}{}</b>
                    )
                  })}

                

                <a class="testiranjeDugme btn btn-primary btn-lg"  href={pdfFile} target = "_blank">Pdf Pacijenta</a>
  
  
  <p className='placenoTekst'>Testovi placeno: {this.state.ceoObjekat.platio.test} / {this.state.ceoObjekat.ukupnoDuguje.test}</p>
  <p className='placenoTekst'>Individualni placeno: {this.state.ceoObjekat.platio.individualni} / {this.state.ceoObjekat.ukupnoDuguje.individualni} <Button onClick={()=>{vratiNovac(this.state.ceoObjekat.Ime,this.state.ceoObjekat.Prezime,"Individualni")}} className='upisivanjeDugme' variant="info"  >Povracaj</Button></p>
  <p className='placenoTekst'>Grupni placeno: {this.state.ceoObjekat.platio.grupni} / {this.state.ceoObjekat.ukupnoDuguje.grupni} <Button onClick={()=>{vratiNovac(this.state.ceoObjekat.Ime,this.state.ceoObjekat.Prezime,"Grupa")}} className='upisivanjeDugme' variant="info"  >Povracaj</Button></p>


  
            </div>
  
          
                
                    <div className='listaIndividualna'>
                        
                    
  
                            <p className='evidencijaNaslovi'>Individualni</p>
  
                          {this.state.nizGrupaIndividualni.map((grupa)=>{
                            return(

                             

                            <ListGroup className='mesecnaLista' as="ul">
                            <ListGroup.Item className='naslovListe' as="li" active>
                                {grupa[0].grupaBr}
                                {/* {" "+this.state.ceoObjekat.opisiGrupa.indOpisi[grupa[0].grupaBr-1]}
                                <Button onClick={()=>{dodajOpisGrupi(this.state.ceoObjekat.Ime,this.state.ceoObjekat.Prezime,grupa[0].grupaBr)}} className='upisivanjeDugme' size="sm" variant="danger"  >opis</Button>
                            */}
                            </ListGroup.Item>
                              {grupa.map((datum,index)=>{
                                  if(datum.kolicina != null){
                                    if(datum.kolicina>0)
                                    return(
                                    <ListGroup.Item variant="success" onClick={()=>listaUplataKlik(this.state.ceoObjekat.Ime ,this.state.ceoObjekat.Prezime,datum.dan+'.'+datum.mesec+'.'+datum.godina+'_'+datum.kolicina+'_'+grupa[0].grupaBr,false)}>{datum.dan+'.'+datum.mesec+'.'+datum.godina}
                                    <span class="badge badge-pill badge-primary">UPLATA</span>
                                    {datum.kolicina} Dinara 
                                    </ListGroup.Item>

                                    )
                                    else
                                    return(
                                    <ListGroup.Item variant="danger" onClick={()=>listaUplataKlik(this.state.ceoObjekat.Ime ,this.state.ceoObjekat.Prezime,datum.dan+'.'+datum.mesec+'.'+datum.godina+'_'+datum.kolicina+'_'+grupa[0].grupaBr,false)}>{datum.dan+'.'+datum.mesec+'.'+datum.godina}
                                    <span class="badge badge-pill badge-primary">POVRACAJ</span>
                                    {datum.kolicina} Dinara 
                                    </ListGroup.Item>

                                    )

                                  }
                                  else{
                                    return(
                                     <ListGroup.Item as="li" onClick={() => listaKlik(this.state.ceoObjekat.Ime ,this.state.ceoObjekat.Prezime,datum.dan+'.'+datum.mesec+'.'+datum.godina+'_'+grupa[0].grupaBr,false)}>{index+1 + " " + datum.dan+'.'+datum.mesec+'.'+datum.godina}</ListGroup.Item>
                                    )
                                  }

                              })}

                            </ListGroup>
                            
                            )
                          })}

                    </div>
  
  
                        <p className='evidencijaNaslovi'>Grupni</p>
                    <div className='listaIndividualna2'>
                        
                    
  
  
  
  
                        {this.state.nizGrupa.map((grupa)=>{

                            return(

                             

                            <ListGroup className='mesecnaLista' as="ul">
                            <ListGroup.Item className='naslovListe' as="li" active>
                                {grupa[0].grupaBr}
                            </ListGroup.Item>
                              {grupa.map((datum,index)=>{
                                  if(datum.kolicina != null){
                                    if(datum.godina === ""){
                                      return(<ListGroup.Item as="li" variant="warning" onClick={()=>{listaPrazanKlik(this.state.ceoObjekat.Ime ,this.state.ceoObjekat.Prezime,grupa[0].grupaBr)}}>{}</ListGroup.Item>)
                                    }else if(datum.kolicina>0)
                                    return(
                                    <ListGroup.Item variant="success" onClick={()=>listaUplataKlik(this.state.ceoObjekat.Ime ,this.state.ceoObjekat.Prezime,datum.dan+'.'+datum.mesec+'.'+datum.godina+'_'+datum.kolicina+'_'+grupa[0].grupaBr,true)}>{datum.dan+'.'+datum.mesec+'.'+datum.godina}
                                    <span class="badge badge-pill badge-primary">UPLATA</span>
                                    {datum.kolicina} Dinara 
                                    </ListGroup.Item>

                                    )
                                    else
                                    return(
                                      <ListGroup.Item variant="danger" onClick={()=>listaUplataKlik(this.state.ceoObjekat.Ime ,this.state.ceoObjekat.Prezime,datum.dan+'.'+datum.mesec+'.'+datum.godina+'_'+datum.kolicina+'_'+grupa[0].grupaBr,true)}>{datum.dan+'.'+datum.mesec+'.'+datum.godina}
                                      <span class="badge badge-pill badge-primary">POVRACAJ</span>
                                      {datum.kolicina} Dinara 
                                      </ListGroup.Item>
                                    )
                                  }else{
                                    if(datum.godina === ""){
                                      return(<ListGroup.Item as="li" variant="warning" onClick={()=>{listaPrazanKlik(this.state.ceoObjekat.Ime ,this.state.ceoObjekat.Prezime,grupa[0].grupaBr)}}>{index+1+". "}</ListGroup.Item>)
                                    }else 
                                    return(
                                     <ListGroup.Item as="li" onClick={() => listaKlik(this.state.ceoObjekat.Ime ,this.state.ceoObjekat.Prezime,datum.dan+'.'+datum.mesec+'.'+datum.godina+'_'+grupa[0].grupaBr,true)}>{index+1 + ". " + datum.dan+'.'+datum.mesec+'.'+datum.godina}</ListGroup.Item>
                                    )
                                  }

                              })}

                            </ListGroup>
                            
                            )
                          })}
                </div>
                
        
            
        </div>
      );
      }
      else
      return (<div></div>);
   
    }
}
export default Evidencija;