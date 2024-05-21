// import PhotosUploader from "../PhotosUploader.jsx";
import Perks from './Perks'
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';


import {Navigate, useNavigate} from "react-router-dom";

export default function PlacesFormPage() {
  const [cssclass,setCssClass]=useState('')

  useEffect(() => {
    if(JSON.parse(localStorage.getItem('user')).email=='admin@test.com' ){
      setCssClass('md:!ml-[279px] md:!-mt-[680px] md:!overflow-y-scroll md:!max-h-screen md:!w-[1070px]  ')
    }
    window.scrollTo(0, 0)
  }, [])

  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  //   const [addedPhotos,setAddedPhotos] = useState([]);
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [maxPersons, setmaxPersons] = useState(1);
  const [cost,setCost] = useState(100);

const navigate=useNavigate()
  useEffect(()=>{
    JSON.parse(localStorage.getItem('user')).email!=='admin@test.com' && JSON.parse(localStorage.getItem('user')).password!=='admin1234' && navigate('/')
  },[])

  function inputHeader(text: any) {
    return (
      <h2 className="text-2xl mt-4">{text}</h2>
    );
  }
  function inputDescription(text: any) {
    return (
      <p className="text-gray-500 text-sm">{text}</p>
    );
  }
  function preInput(header: any, description: any) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }


  //   if (redirect) {
  //     return <Navigate to={'/account/places'} />
  //   }


  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [departure, setdeparture] = useState('')
  const [arrival, setarrival] = useState('')
  const [error, setError] = useState(false)

  //firebase
  var [url, setUrl] = useState();
  const [img, setImg] = useState();
  let percentVal;
  const firebaseConfig = {
    apiKey: "AIzaSyBNnRaNm8LSWJcwseANwYWxXd7UNSXaoFo",
    authDomain: "fir-d7c90.firebaseapp.com",
    projectId: "fir-d7c90",
    storageBucket: "fir-d7c90.appspot.com",
    messagingSenderId: "579090468562",
    appId: "1:579090468562:web:63c369327a7dffd087a70b",
    measurementId: "G-7LBK1668RT"
  };
  const app = initializeApp(firebaseConfig);
  let fileItem;
  let fileName;

  function getFile(e) {
    console.log(e.target.files[0])
    fileItem = e.target.files[0];
    fileName = fileItem.name;

  }
  function uploadImage() {
    console.log(app)
    const storage = getStorage(app, firebaseConfig.storageBucket);
    const storageRef = ref(
      storage,
      "images/" + fileName
    )
    const uploadTask = uploadBytesResumable(storageRef, fileItem);
    uploadTask.on("state_changed", (snapshot) => {
      console.log(snapshot)
      percentVal = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
      console.log(percentVal)
    }, (error) => { console.log(error) }, () => {
      getDownloadURL(uploadTask.snapshot.ref).then((url) => {
        console.log("url", url)
        if (url !== '') {
          setUrl(url)
          setImg(url)

        }
      })
    })


    console.log("Image", img)


  }


var [perk,setPerk]=useState('')
  console.log(perks)
  perk=perks.toString();
  console.log("str",perk)
  console.log("perks",perks.toString())
  
 
  //add-package
  function add() {
    if (!name || !price || !departure || !arrival ||!maxPersons ||!cost ||!description  ||!img ||!extraInfo) {
      console.log(!name)
      setError(true);
      return false;

    }
    
    // const userId = JSON.parse(localStorage.getItem('user'))._id;
    fetch("http://localhost:4000/add-package", {
      method: "post",
      headers: {
        'Content-Type': "application/json",
        // authorization:"bearer "+JSON.parse(localStorage.getItem('token'))
      },
      body: JSON.stringify({ name, price,img, description,extraInfo,departure, arrival,maxPersons,cost,perk })
    }).then((resp) => {
      resp.json().then((result) => {
        console.log("result",result.perks)
        alert("Product added successfully")
        navigate('/package-list')

      })
    })
  }


// const [cssclass,setCssClass]=useState('')
// if(JSON.parse(localStorage.getItem('user')).email=='admin@test.com' ){
//   setCssClass('ml-10')
// }

  return (
    <div className={ `justify-center mt-8 md:mx-[300px] ${cssclass} `}>

      <div className=" mx-auto">
        {preInput('Name', 'Title for your package. should be short and catchy as in advertisement')}
        <input type="text" onChange={(event) => setName((event.target.value))} placeholder="Name, for example: Skardu-movers" />
        {error && !name && <span className='text-red-500 block -ml-[0px]'>Enter valid title </span>}
        {preInput('Address', 'Address to this place')}
        <input type="text" onChange={(event) => setPrice(event.target.value)} placeholder="address" />
        {error && !price && <span className='text-red-500 block -ml-[0px]'>Enter valid address </span>}
        {preInput('Photos','.png, .jpg')}
        <input type="file"  accept="image/*" onChange={(e) => getFile(e)} />
        <button className='bg-[whitesmoke] border-[1px] border-solid border-[gray] p-[3px] hover:bg-slate-300' onClick={() => uploadImage()}>upload</button>
      <br />
      <br />
      {img ?
        <img src={img} height={100} width={100} /> : ''}
{error && !img && <span className='text-red-500 block -ml-[0px]'>Upload image</span>}
        {/* <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} /> */}
        {preInput('Description', 'description of the package')}
        <textarea value={description} onChange={ev => setDescription(ev.target.value)} />
        {error && !description && <span className='text-red-500 block -ml-[0px]'>Enter valid description </span>}
       
        {preInput('Perks', 'select all the perks of your package')}
        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <Perks selected={perks} onChange={setPerks} />
          
          
          
        </div>
        {preInput('Extra info', 'rulings, etc')}
        <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />
        {error && !extraInfo && <span className='text-red-500 block -ml-[0px]'>Enter valid info </span>}
        {preInput('', '')}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1">Departure </h3>
            <input type="date"

              onChange={(event) => setdeparture(event.target.value)}
              placeholder="14" />
            {error && !departure && <span className='text-red-500 block -ml-[0px]'>Enter valid departure </span>}
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Arrival</h3>
            <input type="date"

              onChange={(event) => setarrival(event.target.value)}
              placeholder="11" />
            {error && !arrival && <span className='text-red-500 block -ml-[0px]'>Enter valid arrival </span>}
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Persons</h3>
            <input type="number" value={maxPersons}
              onChange={(ev: any) => setmaxPersons(ev.target.value)} />
              {error && !maxPersons && <span className='text-red-500 block -ml-[0px]'>Enter valid persons </span>}
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Price </h3>
            <input type="number" value={cost}
              onChange={(ev: any) => setCost(ev.target.value)} />
              {error && !cost && <span className='text-red-500 block -ml-[0px]'>Enter valid price</span>}
          </div>
        </div>
        <button className="primary my-4" onClick={() => add()}>Save</button>
      </div>
    </div>
  );
}