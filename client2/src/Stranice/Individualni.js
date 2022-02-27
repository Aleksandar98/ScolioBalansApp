import ListGroup from 'react-bootstrap/ListGroup'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ArrowLeftCircleFill } from 'react-bootstrap-icons';
import Swal from 'sweetalert2';
import Button from 'react-bootstrap/Button';

import React, { useState } from 'react';


export default function Individualni() {

 // const Pdf = React.lazy(() => import('../test.pdf'));
  // const [numPages, setNumPages] = useState(null);
  // const [pageNumber, setPageNumber] = useState(1);
  
  // function onDocumentLoadSuccess({ numPages }) {
  //   setNumPages(numPages);
  // }

     const listaKlik =()=>{
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
                      console.log(datum)
                    Swal.fire(`Unet datum: ${datum}`)
                  }else{
                    console.log("greska")
                  }
            } else if (result.isDenied) {
              Swal.fire('Termin obrisan', '', 'success')
            }
          })
    }

    const logoKlik =()=>{
        
    }

    const placanjeKlik =async()=>{
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

    const dolazakKlik =()=>{
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'success',
        title: 'Signed in successfully'
      })
    }

    return (
        <div>
        <div className='listaIndividualna'>
          
      
          <div className='individualniHeader'>
              <img onClick={logoKlik} className='imgLogo' src='https://instagram.fbeg5-1.fna.fbcdn.net/v/t51.2885-19/s150x150/120459731_173941517617630_4768313697812483395_n.jpg?tp=1&_nc_ht=instagram.fbeg5-1.fna.fbcdn.net&_nc_ohc=5rovO_1BvMcAX-D-qbK&oh=10c97169a66005d6e609a7e1ea529c2a&oe=606EA940'></img>

              <label className='individualniNaslov'>Individualni trennzi</label>
          </div>

          <p className='individualniIme'>Aleksandar Mitrovic</p>

          <div className='buttonHolderIndi'>

          <Button className='placanjeBtn' variant="btn btn-outline-light" onClick={placanjeKlik} >Placanje</Button>{' '}
          </div>
          <div className='buttonHolderIndi'>
          <Button className='terminBtn' variant="btn btn-outline-light" onClick={dolazakKlik} >Zabelezi dolazak</Button>{' '}

          </div>


          <div>
      {/* <Document
        file="./test.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <p>Page {pageNumber} of {numPages}</p> */}

    </div>
          <ListGroup className='mesecnaLista' as="ul">
              <ListGroup.Item className='naslovListe' as="li" active>
                  Januar 2021
              </ListGroup.Item>
              <ListGroup.Item as="li" onClick={listaKlik}>4.1.2021 </ListGroup.Item>
              <ListGroup.Item as="li">5.1.2021</ListGroup.Item>
              <ListGroup.Item variant="success" >9.1.2021</ListGroup.Item>
              <ListGroup.Item variant="danger">10.1.2021</ListGroup.Item>
              <ListGroup.Item variant="warning">11.1.2021</ListGroup.Item>
          </ListGroup>

          <ListGroup className='mesecnaLista' as="ul">
              <ListGroup.Item className='naslovListe' as="li" active>
                  Februar 2021
              </ListGroup.Item>
              <ListGroup.Item variant="warning" >9.2.2021</ListGroup.Item>
              <ListGroup.Item variant="warning">10.2.2021</ListGroup.Item>
              <ListGroup.Item variant="warning">11.2.2021</ListGroup.Item>
          </ListGroup>
      </div>
        </div>

      );
}