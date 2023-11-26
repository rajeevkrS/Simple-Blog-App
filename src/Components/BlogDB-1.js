import { useState, useEffect, useRef } from "react";
import { db } from "../firebaseinit";
import { collection, addDoc, /*getDocs*/ onSnapshot, doc, deleteDoc  } from "firebase/firestore"; 

//Blogging App using Hooks
export default function BlogDB1() {

  // useState()
  // creating a state where I am setting title and content together in an object.
  const [formData, setFormData] = useState({ title: "", content: "" });

  // This state used to store title & content in an array.
  const [blogs, setBlogs] = useState([]);

  // useRef()
  const titleRef = useRef(null);

  // useEffect() -componentDidMount()
  useEffect(() => {
    // focus to the title field on initial render of the app
    titleRef.current.focus();
  }, []);  // empty dependency array bacause this should happend only at initial render, not at the consecutive updates which are happening after every addition of blog.

  // Rendering the Title of the every blog on Tab when it gets added.
  useEffect(() => {
    if (blogs.length) {
      document.title = blogs[0].title;
  
      // Set a timeout to remove the title after 3 seconds
      const timeoutId = setTimeout(() => {
        document.title = "Add Blog Please!!"; 
      }, 2000);
  
      // Clear the timeout when the component unmounts or when the effect runs again
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [blogs]); // condition on every addition of blog


  // useEffect() -componentDidMount()
  useEffect(() => {
    // // Firebase : Getting data from DB using the "getdDoc()" method
    // // Fetching all the docs from db.
    // async function fetchData(){
    //   const querySnapshot = await getDocs(collection(db, "blogs"));
    //   // console.log(querySnapshot);

    //   // saving all the mapped docs with id inside blogs variable.
    //   const blogs = querySnapshot.docs.map((doc) => {
    //     return {
    //       id: doc.id, // ID of every blog
    //       ...doc.data() // returning the data from db, so everything which is their in db except "id", I'll just use ('...') spread operator by which it will give every data to the blogs variable.
    //     }
    //   });
    //   // console.log(blogs);
    //   setBlogs(blogs); // setting all the blogs to setBlogs array.
    // }
    // fetchData(); // calling the operation


    // Firebase : Getting Real-Time Updates of data from DB using the "onSnapshot()" method on all the device at the same time.
    onSnapshot(collection(db, "blogs"), (snapShot) => {
      const blogs = snapShot.docs.map((doc) => {
        return{
          id: doc.id, // ID of every blog
          ...doc.data() // returning the data from db, so everything which is their in db except "id", I'll just use ('...') spread operator by which it will give every data to the blogs variable.
        }
      });
      // console.log(blogs);
      setBlogs(blogs); // setting all the blogs to setBlogs       
    });
  },[])

  //Passing the synthetic event as argument to stop refreshing the page on submit
  async function handleSubmit(e) {
    e.preventDefault();

    // Check if both title and content are not empty
    if (formData.title.trim() !== "" && formData.content.trim() !== "") {

      // Manually Setting the Blogs
      // used the rest operator "..." which will store the blogs manually & temporarily in an array until the page gets reloaded.
      // setBlogs([
      //   {
      //     title: formData.title,
      //     content: formData.content
      //   },
      //   ...blogs,
      // ]);

      // Firebase : Adding data to DB using the "addDoc()" method.
      // Add a new document with a generated id.
      await addDoc(collection(db, "blogs"), {
        title: formData.title,
        content: formData.content,
        createdOn: new Date()
      });
      // console.log("Document written with ID: ", docRef.id);

      // resetting the input field after adding the blog
      setFormData({
        title: "",
        content: "",
      });

      // focus on Title input
      titleRef.current.focus();

      // console.log(blogs);
    } else {
      // Handle the case where either title or content is empty
      alert("Title and Content cannot be empty!");
    }
  }

  // // Remove Blog
  // function removeBlog(index) {
  //   // I just need to match the id with index no. of blogs in "blogs" because if deletion happens then filter funtion will filter-out all the blogs except the deleted blogs and then save all the blogs in "setBlogs". 
  //   // So this "blogs.filter()" will come in "setBlogs" bacause we are setting new blogs array which doesn't contain deleted blogs.
  //   setBlogs(blogs.filter((blog, id) => index !== id));
  // }

  // Remove Blog From Firebase
  async function removeBlog(id){

    // Firebase : Deleting data from DB using the "doc()" method and takes id from onSnapshot which passed via delete button.
    const docRef = doc(db, "blogs", id);
    deleteDoc(docRef);
  }

  // Function to format date and time
  function formatDateTime(timestamp) {
    if (timestamp && timestamp.toDate) {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
      return new Date(timestamp.toDate()).toLocaleString(undefined, options);
    } else {
      return "Invalid Date";
    }
  }  
  

  return (
    <>
      {/* Heading of the page */}
      <h1>Write a Blog!</h1>

      {/* Division created to provide styling of section to the form */}
      <div className="section">
        {/* Form for to write the blog */}
        <form onSubmit={handleSubmit}>
          {/* Row component to create a row for first input field */}
          <Row label="Title">
            <input
              className="input"
              placeholder="Enter the Title of the Blog here.."
              value={formData.title}
              ref={titleRef}
              onChange={(e) =>
                setFormData({
                  title: e.target.value,
                  content: formData.content,
                })
              }
              // Mention keys in order whatever I want to update whenever I want to set the data using useState.
            />
          </Row>

          {/* Row component to create a row for Text area field */}
          <Row label="Content">
            <textarea
              className="input content"
              placeholder="Content of the Blog goes here.."
              value={formData.content}
              onChange={(e) =>
                setFormData({ title: formData.title, content: e.target.value })
              }
              // Mention keys in order whatever I want to update whenever I want to set the data using useState.
            />
          </Row>

          {/* Button to submit the blog */}
          <button className="btn">ADD</button>
        </form>
      </div>

      <hr />

      {/* Section where submitted blogs will be displayed */}
      <h2> Blogs </h2>

      {/* Submitted Blogs */}
      {blogs.map((element, index) => (
        <div className="blog" key={index}>

          <span className="date-time">{formatDateTime(element.createdOn)}</span>

          <h3>{element.title}</h3>
          <h4>{element.content}</h4>

          <div className="blog-btn">
            {/* using "id" of every doc from onSnapshot() functionality will helps in removing the particular blog with the removeBlog funtion using doc() method */}
            <button onClick={() => removeBlog(element.id)} className="remove">
              Delete
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

//Row component to introduce a new row section in the form
function Row(props) {
  const { label } = props;
  return (
    <>
      <label>
        {label}
        <br />
      </label>
      {props.children}
      <hr />
    </>
  );
}
